import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Local API Gateway URL
  const API_URL = "https://lead-wise-song-data-processor.onrender.com/process";

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select an Excel file first.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setStatus("Processing failed. Please check the file or try again.");
        setLoading(false);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Filled_Data.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus("File processed successfully! Download started.");
    } catch (error) {
      console.error(error);
      setStatus("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="w-full bg-blue-600 text-white shadow-md">
  <div className="max-w-5xl mx-auto px-4 py-4 flex justify-center">
    <h1 className="text-2xl font-semibold tracking-wide">
      Lead-wise Song Data Processor
    </h1>
  </div>
</header>


      <main className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-3xl bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Upload <span className="text-blue-600">Full Song Data.xlsx</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="file" accept=".xlsx" onChange={handleFileChange} />

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Processing..." : "Process & Download Excel"}
            </button>
          </form>

          {status && <p className="mt-4 text-sm">{status}</p>}
        </div>
      </main>

      <footer className="w-full text-center py-4 text-sm text-gray-600">
        Developed by <strong>Mangeshh Gaykar</strong>
      </footer>
    </div>
  );
}

export default App;
