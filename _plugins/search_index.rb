# frozen_string_literal: true

module Jekyll
  class SearchIndexGenerator < Generator
    safe true
    priority :low

    COLLECTION_TYPES = %w[publications portfolio talks teaching].freeze

    def generate(site)
      docs = []

      site.pages.each do |page|
        next unless page.data["title"]

        docs << {
          "id" => page.url,
          "title" => page.data["title"],
          "excerpt" => searchable_text(page.data["excerpt"], page.content),
          "url" => page.url,
          "category" => "pages"
        }
      end

      site.collections.each do |name, collection|
        next unless COLLECTION_TYPES.include?(name)

        collection.docs.each do |doc|
          docs << {
            "id" => doc.url,
            "title" => doc.data["title"],
            "excerpt" => searchable_text(doc.data["excerpt"], doc.content),
            "url" => doc.url,
            "category" => name.to_s
          }
        end
      end

      json = JSON.generate({ "docs" => docs })
      site.static_files << SearchIndexFile.new(site, "search_index.json", json)
    end

    private

    def searchable_text(excerpt, content)
      text = excerpt || content
      return "" if text.nil?

      text.to_s.gsub(/<[^>]+>/, " ").gsub(/\s+/, " ").strip.tr("\u2019", "'")
    end
  end

  class SearchIndexFile < StaticFile
    def initialize(site, name, content)
      @content = content
      super(site, site.source, "", name)
    end

    def write(dest)
      dest_path = destination(dest)
      FileUtils.mkdir_p(File.dirname(dest_path))
      File.write(dest_path, @content)
    end
  end
end
