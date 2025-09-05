import { useState, useRef, useEffect } from "react";
import FroalaEditor from "react-froala-wysiwyg";

const A4_HEIGHT = 1123; // pixels
const A4_WIDTH = 700; // pixels

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
        const element = el as HTMLElement;

        // 🔹 Force page break if user inserted one
        if (
          element.classList.contains("page-break") ||
          element.classList.contains("fr-page-break")
        ) {
          if (currentPage.length > 0) {
            newPages.push(currentPage);
          }
          currentPage = [];
          currentHeight = 0;
          return;
        }

        const elHeight = element.offsetHeight + 5;

        // 🔹 If element is too tall for current page but can fit on a new page
        if (elHeight > A4_HEIGHT) {
          // Split the content of this element if it's a paragraph
          if (element.tagName === "P") {
            const textContent = element.textContent || "";
            const words = textContent.split(" ");
            const lineHeight = 20; // Approximate line height in pixels
            
            // Calculate how many lines fit on current page
            const remainingSpace = A4_HEIGHT - currentHeight;
            const linesThatFit = Math.floor(remainingSpace / lineHeight);
            
            // Calculate how many words fit in those lines (approx 15 words per line)
            const wordsThatFit = Math.max(1, linesThatFit * 15);
            
            if (wordsThatFit < words.length && wordsThatFit > 0) {
              // Split the paragraph
              const firstPart = words.slice(0, wordsThatFit).join(" ");
              const secondPart = words.slice(wordsThatFit).join(" ");
              
              // Add first part to current page
              currentPage.push(`<p>${firstPart}</p>`);
              newPages.push(currentPage);
              
              // Start new page with second part
              currentPage = [`<p>${secondPart}</p>`];
              currentHeight = (secondPart.split(" ").length / 15) * lineHeight;
              return;
            }
          }
        }

        // 🔹 Auto page break if element overflows
        if (elHeight + currentHeight > A4_HEIGHT) {
          // If it's a paragraph and we can split it
          if (element.tagName === "P" && currentHeight > 0) {
            const textContent = element.textContent || "";
            const words = textContent.split(" ");
            const lineHeight = 20; // Approximate line height in pixels
            
            // Calculate how many lines fit on current page
            const remainingSpace = A4_HEIGHT - currentHeight;
            const linesThatFit = Math.floor(remainingSpace / lineHeight);
            
            // Calculate how many words fit in those lines (approx 15 words per line)
            const wordsThatFit = Math.max(1, linesThatFit * 15);
            
            if (wordsThatFit < words.length && wordsThatFit > 0) {
              // Split the paragraph
              const firstPart = words.slice(0, wordsThatFit).join(" ");
              const secondPart = words.slice(wordsThatFit).join(" ");
              
              // Add first part to current page
              currentPage.push(`<p>${firstPart}</p>`);
              newPages.push(currentPage);
              
              // Start new page with second part
              currentPage = [`<p>${secondPart}</p>`];
              currentHeight = (secondPart.split(" ").length / 15) * lineHeight;
              return;
            }
          }
          
          // If we can't split, push current page and start new one
          newPages.push(currentPage);
          currentPage = [element.outerHTML];
          currentHeight = elHeight;
        } else {
          // Add element to current page
          currentPage.push(element.outerHTML);
          currentHeight += elHeight;
        }
      });

      // ✅ Push last page
      if (currentPage.length > 0) {
        newPages.push(currentPage);
      }

      setPages(newPages);
    }
  }, [model]);

  return (
    <div className="relative overflow-hidden flex w-full h-screen p-4 gap-4 bg-gray-200">
      {/* Left: Froala Editor */}
      <div className="w-[650px] border p-3 bg-white rounded-lg shadow-md">
        <FroalaEditor
          model={model}
          onModelChange={(content: string) => setModel(content)}
          config={{
            placeholderText: "Start typing ...",
            charCounterCount: false,
            attribution: false,
            wordCounterCount: false,
            width: "100%",
            heightMin: 450,
            heightMax: 450,
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
              <div className="w-full h-full p-10 border border-gray-300">
                <div
                  dangerouslySetInnerHTML={{ __html: page.join("") }}
                  className="text-black"
                />
                <div className="text-center text-xs text-gray-500 mt-4">
                  Page {index + 1} of {pages.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden container for measuring elements */}
      <div
        ref={hiddenRef}
        className="absolute opacity-0 pointer-events-none"
        style={{ width: `${A4_WIDTH - 80}px`, fontFamily: "Times New Roman, serif", fontSize: "12pt", padding: "40px" }}
        dangerouslySetInnerHTML={{ __html: model }}
      />
    </div>
  );
};

export default TextEditor;