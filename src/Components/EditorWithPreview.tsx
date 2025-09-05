import { useState, useEffect, useRef } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import { Previewer } from "pagedjs";

const EditorWithPreview = () => {
  const [content, setContent] = useState<string>("");
  const previewRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .pagedjs_pages {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .pagedjs_page {
        width: 210mm;
        height: 297mm;
        margin: 20px 0;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        background: white;
        overflow: hidden;
        position: relative;
      }
      .pagedjs_page_content {
        box-sizing: border-box;
        min-height: 257mm;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const updatePreview = async () => {
      const previewElement = previewRef.current;
      if (!previewElement) return;

      // Save current scroll position
      scrollPosition.current = previewElement.scrollTop;

      previewElement.innerHTML = "";

      const sourceElement = document.createElement("div");
      sourceElement.innerHTML = content;
      sourceElement.style.display = "none";
      document.body.appendChild(sourceElement);

      const previewer = new Previewer();
      await previewer.preview(sourceElement, [], previewElement).then(() => {
        const pages = previewElement.getElementsByClassName("pagedjs_page");
        if (pages.length > 0) {
          Array.from(pages).forEach((page) => {
            const htmlPage = page as HTMLElement;
            htmlPage.style.height = "297mm";
          });
        }
      });

      requestAnimationFrame(() => {
        if (previewElement) {
          previewElement.scrollTop = scrollPosition.current;
        }
      });

      document.body.removeChild(sourceElement);
    };

    updatePreview();
  }, [content]);

  return (
    <div className="flex gap-4 ">
      <div className="w-1/2">
        <h2 className="text-lg font-bold m-2">Editor</h2>
        <FroalaEditor
         config={{
            placeholderText: "Start typing ...",
            charCounterCount: false,
            attribution: false,
            wordCounterCount: false,
            width: "100%",
            heightMin: 400,
            heightMax: 400,
          }}
      
          tag="textarea"
          model={content}
          onModelChange={(newContent: string) => setContent(newContent)}
        />
      </div>
      <div className="w-1/2 overflow-auto h-[90vh] bg-gray-100 p-4">
        <h2 className="text-lg font-bold mb-2">Preview (Word style)</h2>
        <div id="preview" ref={previewRef}></div>
      </div>
    </div>
  );
};

export default EditorWithPreview;