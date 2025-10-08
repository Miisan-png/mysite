using System.Text;
using System.Text.Json;
using Markdig;

partial class Entry
{
    public readonly string Name = "";
    public readonly string Type;
    public readonly Dictionary<string, string> Variables = [];
    public readonly string SourcePath;
    public readonly bool Valid = false;
    public readonly string DestPath = string.Empty;

    public Entry(string path, string rel, string site, string type)
    {
        SourcePath = path;
        Type = type;

        var indexPath = Path.Combine(SourcePath, "index.json");
        if (!File.Exists(indexPath))
        {
            indexPath = Path.Combine(SourcePath, "index.md");
            if (!File.Exists(indexPath))
                return;
        }

        var contents = File.ReadAllText(indexPath).Split("---");
        var json = contents[0];
        var desc = contents.Length > 1 ? contents[1] : "";
        var document = JsonDocument.Parse(json, new JsonDocumentOptions { AllowTrailingCommas = true }).RootElement;
        if (document.ValueKind != JsonValueKind.Object)
            return;

        foreach (var entry in document.EnumerateObject())
        {
            var key = entry.Name.ToLower();
            if (key == "links" && entry.Value.ValueKind == JsonValueKind.Array)
            {
                var links = new StringBuilder();
                foreach (var linkEntry in entry.Value.EnumerateArray())
                {
                    if (linkEntry.ValueKind != JsonValueKind.Object) continue;
                    var url = linkEntry.TryGetProperty("url", out var u) ? u.GetString() ?? "" : "";
                    var label = linkEntry.TryGetProperty("label", out var l) ? l.GetString() ?? "" : "";
                    links.AppendLine($"<a href=\"{url}\">{label}</a><br />");
                }
                Variables.Add("links", links.ToString());
            }
            else
            {
                switch (entry.Value.ValueKind)
                {
                    case JsonValueKind.String:
                        Variables.Add(entry.Name, entry.Value.GetString() ?? "");
                        break;
                    case JsonValueKind.Number:
                        Variables.Add(entry.Name, entry.Value.GetDouble().ToString());
                        break;
                    case JsonValueKind.True:
                        Variables.Add(entry.Name, "true");
                        break;
                    case JsonValueKind.False:
                        Variables.Add(entry.Name, "false");
                        break;
                }
            }
        }

        if (desc.Length <= 0 && Variables.TryGetValue("description", out var description))
            Variables.Add("body", description);
        else
            Variables.Add("body", desc);

        if (Variables.TryGetValue("body", out var body))
            Variables["body"] = Markdown.ToHtml(body);

        if (File.Exists(Path.Combine(SourcePath, "preview.png")))
            Variables.Add("preview", "preview.png");

        if (File.Exists(Path.Combine(SourcePath, "postcard.png")))
        {
            Variables.Add("postcard", "postcard.png");
            Variables["postcard_visible"] = "true";
        }
        else
            Variables.Add("postcard_visible", "false");

        Name = Path.GetFileNameWithoutExtension(path);
        while (Name.Length > 0 && (char.IsDigit(Name[0]) || Name[0] == '_'))
            Name = Name[1..];

        Variables["rel"] = rel;
        Variables["path"] = $"{rel}{type}/{Name}";
        Variables["url"] = $"{rel}{type}/{Name}";
        Variables["site_url"] = $"{site}{rel}{type}/{Name}";

        DestPath = $"{type}/{Name}";
        Valid = true;
    }

    public void CopyFiles(string destination)
    {
        foreach (var file in Directory.EnumerateFiles(SourcePath))
        {
            if (!file.EndsWith(".json") && !file.EndsWith(".md"))
            {
                var dest = Path.Combine(destination, Path.GetFileName(file));
                Directory.CreateDirectory(Path.GetDirectoryName(dest)!);
                File.Copy(file, dest, true);
            }
        }
    }
}

class Generator
{
    public readonly Dictionary<string, string> Partials = new(StringComparer.OrdinalIgnoreCase);
    public readonly Dictionary<string, List<Entry>> Entries = new(StringComparer.OrdinalIgnoreCase);

    public Generator(string path, string[] entryTypes, string rel, string site)
    {
        foreach (var file in Directory.EnumerateFiles(Path.Combine(path, "partials")))
            Partials.Add(Path.GetFileNameWithoutExtension(file), File.ReadAllText(file));

        foreach (var type in entryTypes)
        {
            Entries[type] = [];
            foreach (var dir in Directory.EnumerateDirectories(Path.Combine(path, type)))
                Entries[type].Add(new Entry(dir, rel, site, type));
        }
    }

    public string Generate(string template, Dictionary<string, string> variables)
    {
        var result = new StringBuilder();
        var src = template.AsSpan();

        for (int i = 0; i < src.Length; i++)
        {
            if (!src[i..].StartsWith("{{"))
            {
                result.Append(src[i]);
                continue;
            }

            int start = i + 2;
            int end = start;
            while (end < src.Length && !src[end..].StartsWith("}}")) end++;
            if (end >= src.Length) break;

            var cmd = src[start..end];

            if (cmd.StartsWith("if:"))
            {
                var condition = cmd[3..].ToString();
                if (!variables.TryGetValue(condition, out var value) || string.IsNullOrEmpty(value) || value == "false")
                {
                    var j = end;
                    var depth = 1;
                    while (j < src.Length)
                    {
                        if (src[j..].StartsWith("{{if:")) depth++;
                        else if (src[j..].StartsWith("{{end"))
                        {
                            depth--;
                            if (depth <= 0)
                            {
                                end = j + 5;
                                break;
                            }
                        }
                        j++;
                    }
                }
            }
            else if (cmd.StartsWith("list:"))
            {
                var kind = cmd[5..].ToString();
                var entries = Entries[kind];
                foreach (var entry in entries.AsEnumerable().Reverse())
                {
                    if (entry.Variables.GetValueOrDefault("visible") == "false") continue;
                    var vars = new Dictionary<string, string>(variables);
                    foreach (var kv in entry.Variables) vars[kv.Key] = kv.Value;
                    result.Append(Generate(Partials[$"{kind}_entry"], vars)).Append('\n');
                }
            }
            else if (cmd.StartsWith("partial:"))
                result.Append(Generate(Partials[cmd[8..].ToString()], variables));
            else if (cmd.StartsWith("embed:") && variables.TryGetValue(cmd[6..].ToString(), out var embed))
                result.Append(Markdown.ToHtml(Generate(embed, variables)));
            else if (variables.TryGetValue(cmd.ToString(), out var value))
                result.Append(value);
            else if (!cmd.StartsWith("end"))
                result.Append("{{MISSING}}");

            i = end + 2 - 1;
        }

        return result.ToString();
    }
}

class Program
{
    const string Rel = "/";
    const string Site = "https://miisan.dev";
    const string PublishPath = "public";

    static void Main()
    {
        var root = Directory.GetCurrentDirectory();
        while (!File.Exists(Path.Combine(root, "mysite.csproj")))
            root = Path.Combine(root, "..");
        Directory.SetCurrentDirectory(root);

        if (Directory.Exists(PublishPath))
            Directory.Delete(PublishPath, true);
        Directory.CreateDirectory(PublishPath);

        var generator = new Generator("source", ["games", "posts"], Rel, Site);
        var indexTemplate = File.ReadAllText(Path.Combine("source", "index.html"));
        var postTemplate = File.ReadAllText(Path.Combine("source", "post.html"));

        var indexVars = new Dictionary<string, string>
        {
            { "rel", Rel },
            { "url", Rel },
            { "site_url", $"{Site}{Rel}" },
            { "postcard", "img/profile.jpg" }
        };

        File.WriteAllText(Path.Combine(PublishPath, "index.html"), generator.Generate(indexTemplate, indexVars));

        foreach (var (type, entries) in generator.Entries)
        {
            var outputPath = Path.Combine(PublishPath, type);
            Directory.CreateDirectory(outputPath);
            foreach (var entry in entries)
            {
                if (!entry.Valid) continue;
                var entryPath = Path.Combine(PublishPath, entry.DestPath);
                Directory.CreateDirectory(entryPath);
                File.WriteAllText(Path.Combine(entryPath, "index.html"), generator.Generate(postTemplate, entry.Variables));
                entry.CopyFiles(entryPath);
            }
        }

        var contentSrc = Path.Combine("source", "content");
        if (Directory.Exists(contentSrc))
        {
            foreach (var file in Directory.EnumerateFiles(contentSrc, "*.*", SearchOption.AllDirectories))
            {
                var dest = Path.Combine(PublishPath, Path.GetRelativePath(contentSrc, file));
                Directory.CreateDirectory(Path.GetDirectoryName(dest)!);
                File.Copy(file, dest, true);
            }
        }

        var cssSrc = Path.Combine("source", "css");
        if (Directory.Exists(cssSrc))
        {
            var cssDst = Path.Combine(PublishPath, "css");
            Directory.CreateDirectory(cssDst);
            foreach (var file in Directory.EnumerateFiles(cssSrc, "*.*", SearchOption.AllDirectories))
            {
                var dest = Path.Combine(cssDst, Path.GetFileName(file));
                File.Copy(file, dest, true);
            }
        }

        var imgSrc = Path.Combine("source", "img");
        if (Directory.Exists(imgSrc))
        {
            var imgDst = Path.Combine(PublishPath, "img");
            Directory.CreateDirectory(imgDst);
            foreach (var file in Directory.EnumerateFiles(imgSrc, "*.*", SearchOption.AllDirectories))
            {
                var dest = Path.Combine(imgDst, Path.GetFileName(file));
                File.Copy(file, dest, true);
            }
        }

        var rss = new StringBuilder();
        rss.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
        rss.AppendLine("<rss version=\"2.0\"><channel>");
        rss.AppendLine("\t<title>Miisan</title>");
        rss.AppendLine("\t<link>https://miisan.dev</link>");
        rss.AppendLine("\t<language>en-us</language>");
        rss.AppendLine("\t<description>Portfolio and projects by Miisan</description>");

        foreach (var post in generator.Entries["posts"].Where(p => p.Valid && p.Variables.GetValueOrDefault("visible") != "false").Reverse())
        {
            var date = DateTime.Parse(post.Variables["date"]);
            rss.AppendLine("\t<item>");
            rss.AppendLine($"\t\t<title>{post.Variables["title"]}</title>");
            rss.AppendLine($"\t\t<link>{Site}/{post.DestPath}/index.html</link>");
            rss.AppendLine($"\t\t<description>{post.Variables.GetValueOrDefault("description")}</description>");
            rss.AppendLine($"\t\t<pubDate>{date:ddd, dd MMM yyyy HH:mm:ss zzz}</pubDate>");
            rss.AppendLine("\t</item>");
        }

        rss.AppendLine("\t</channel></rss>");
        File.WriteAllText(Path.Combine(PublishPath, "rss.xml"), rss.ToString());
    }
}
