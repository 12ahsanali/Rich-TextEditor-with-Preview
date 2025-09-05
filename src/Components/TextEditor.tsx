import { useState, useRef, useEffect } from "react";
import FroalaEditor from "react-froala-wysiwyg";

const A4_HEIGHT = 1123; 
const A4_WIDTH = 700; 

const TextEditor = () => {
  const [model, setModel] = useState("");
  const [pages, setPages] = useState<string[][]>([]);
  const hiddenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (hiddenRef.current) {
      const elements = Array.from(hiddenRef.current.children);
      const newPages: string[][] = [];
      let currentPage: string[] = [];
      let currentHeight = 0;

      elements.forEach((el) => {
        const elHeight = (el as HTMLElement).offsetHeight+5;
      
        if (elHeight+currentHeight > A4_HEIGHT) {
          newPages.push(currentPage);
          currentPage = [];
          currentHeight = 0;
        }

        currentPage.push(el.outerHTML);
        currentHeight += elHeight;
      });

      if (currentPage.length > 0) {
        newPages.push(currentPage);
      }

      setPages(newPages);
    }
  }, [model]);

  return (
    <div className="relative overflow-hidden flex w-full h-screen p-4 gap-4 bg-gray-200">
      {/* Left: Froala Editor */}
      <div className="w-[600px] border p-3 bg-white rounded-lg shadow-md">
        <FroalaEditor
          model={model}
          onModelChange={(content: string) => {

              console.log(content),
              setModel(content)}
          }
          config={{
            placeholderText: "Start typing ...",
            charCounterCount: false,
            attribution: false,
            wordCounterCount: false,
            width: "100%",
            heightMin: 400,
            heightMax: 400,
          }}
        />
      </div>

      {/* Right: Preview Pages */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col items-center gap-6">
          {pages.map((page, index) => (
            <div
              key={index}
              className="bg-white shadow-lg border overflow-hidden"
              style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px` }}
            >
              {/* Page inner content with padding & border */}
              <div className="w-full h-full p-10 border border-gray-300">
                <div
                  dangerouslySetInnerHTML={{ __html: page.join("") }}
                  className="text-black"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden container for measuring elements */}
      <div
        ref={hiddenRef}
        className="absolute opacity-0 pointer-events-none w-[794px]"
        dangerouslySetInnerHTML={{ __html: model }}
      />
    </div>
  );
};

export default TextEditor;