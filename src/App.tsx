/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PenTool, Image as ImageIcon, FileText, Share2 } from "lucide-react";
import { ActiveTab, CreativeFactors, PipelineData } from "./types";
import HandDrawnTab from "./components/HandDrawnTab";
import ImageRecognitionTab from "./components/ImageRecognitionTab";
import LyricMatchingTab from "./components/LyricMatchingTab";
import CopywritingTab from "./components/CopywritingTab";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("hand-drawn");

  // Shared Creative Factors Matrix state
  const [factors, setFactors] = useState<CreativeFactors>({
    subject: "",
    scene: "",
    lighting: "",
    style: "",
    posture: "",
    helper: ""
  });

  // Shared Pipeline Result state (persists last drawing results)
  const [pipeline, setPipeline] = useState<PipelineData>({
    factors: {
      subject: "",
      scene: "",
      lighting: "",
      style: "",
      posture: "",
      helper: ""
    },
    promptResult: null,
    imageUrl: null,
    deconstructed: null,
    isFallback: false
  });

  // States for manual tab trigger initiations (cross-over exports)
  const [lyricInitialFactors, setLyricInitialFactors] = useState({
    subject: "",
    scene: "",
    style: "",
    title: ""
  });

  const [copyInitialFactors, setCopyInitialFactors] = useState({
    title: "",
    creativeText: ""
  });

  // Export from Hand-drawn Tab to other tabs
  const handleExport = (targetTab: "lyrics" | "copywriting", title: string, creativeText: string) => {
    if (targetTab === "lyrics") {
      setLyricInitialFactors({
        subject: factors.subject,
        scene: factors.scene,
        style: factors.style,
        title: title
      });
      setActiveTab("lyrics");
    } else if (targetTab === "copywriting") {
      setCopyInitialFactors({
        title,
        creativeText
      });
      setActiveTab("copywriting");
    }
  };

  // Import reverse-engineered factors from Image Recognition back to Hand-drawn Workspace
  const handleImportFactors = (importedFactors: CreativeFactors) => {
    setFactors(importedFactors);
    // Clear last pipeline results to avoid display mismatches, encouraging new run
    setPipeline({
      factors: importedFactors,
      promptResult: null,
      imageUrl: null,
      deconstructed: null,
      isFallback: false
    });
    setActiveTab("hand-drawn");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans select-none selection:bg-black selection:text-white" id="app-root">
      
      {/* HEADER SECTION (Matching mockup design perfectly) */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 md:px-12 py-5 sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between gap-4" id="main-header">
        <div className="flex items-center space-x-3" id="logo-container">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white" id="logo-icon">
            <span className="text-base font-bold font-mono">智</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 font-sans">
            极致简约 AI 全链条工作台
          </h1>
        </div>

        <nav className="flex items-center flex-wrap justify-center gap-1 md:gap-4 text-sm font-medium text-gray-600" id="main-nav">
          {/* Handdrawn button */}
          <button
            onClick={() => setActiveTab("hand-drawn")}
            id="tab-btn-hand-drawn"
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "hand-drawn"
                ? "bg-black text-white font-bold shadow-sm"
                : "hover:text-black hover:bg-gray-50"
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>手工绘图</span>
          </button>

          {/* Recognition button */}
          <button
            onClick={() => setActiveTab("recognition")}
            id="tab-btn-recognition"
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "recognition"
                ? "bg-black text-white font-bold shadow-sm"
                : "hover:text-black hover:bg-gray-50"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>手动识图</span>
          </button>

          {/* Lyrics button */}
          <button
            onClick={() => setActiveTab("lyrics")}
            id="tab-btn-lyrics"
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "lyrics"
                ? "bg-black text-white font-bold shadow-sm"
                : "hover:text-black hover:bg-gray-50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>手动配词</span>
          </button>

          {/* Copywriting button */}
          <button
            onClick={() => setActiveTab("copywriting")}
            id="tab-btn-copywriting"
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "copywriting"
                ? "bg-black text-white font-bold shadow-sm"
                : "hover:text-black hover:bg-gray-50"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>爆款文案</span>
          </button>

          {/* Pipeline ready status pill */}
          <div className="ml-2 bg-gray-50 px-3 py-1.5 rounded-full flex items-center space-x-2 border border-gray-100 shrink-0" id="pulse-badge">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Creative Flow Ready
            </span>
          </div>
        </nav>
      </header>

      {/* BODY/MAIN WORKSPACE SECTION */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8" id="main-content">
        <div 
          className="bg-white w-full max-w-6xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100/50 flex flex-col md:flex-row min-h-[600px] transition-all"
          id="main-dashboard-container"
        >
          {activeTab === "hand-drawn" && (
            <HandDrawnTab
              factors={factors}
              setFactors={setFactors}
              pipeline={pipeline}
              setPipeline={setPipeline}
              onExport={handleExport}
            />
          )}

          {activeTab === "recognition" && (
            <ImageRecognitionTab
              onImportFactors={handleImportFactors}
            />
          )}

          {activeTab === "lyrics" && (
            <LyricMatchingTab
              initialFactors={lyricInitialFactors.subject ? lyricInitialFactors : {
                subject: factors.subject,
                scene: factors.scene,
                style: factors.style,
                title: pipeline.promptResult?.title || ""
              }}
              artworkUrl={pipeline.imageUrl}
            />
          )}

          {activeTab === "copywriting" && (
            <CopywritingTab
              initialFactors={copyInitialFactors.title ? copyInitialFactors : {
                title: pipeline.promptResult?.title || "",
                creativeText: factors.subject ? `主体: ${factors.subject}\n场景: ${factors.scene}\n风格: ${factors.style}` : ""
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
