'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast, Toaster } from 'react-hot-toast';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import { Save } from 'lucide-react';

export default function Create() {
    const [title, setTitle] = useState('Untitled Snippet');
    const [html, setHtml] = useState(`<div class="container">
  <h1>Welcome to Livesite</h1>
  <p>Edit this HTML to see live changes!</p>
  <button onclick="sayHello()">Click Me</button>
</div>`);
    const [css, setCss] = useState(`.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
  
h1 {
  color: #2b6cb0;
  font-family: Arial, sans-serif;
}
  
p {
  font-style: italic;
  color: #4a5568;
}
  
button {
  padding: 10px 20px;
  background-color: #2b6cb0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
  
button:hover {
  background-color: #1a4971;
}`);
    const [js, setJs] = useState(`function sayHello() {
  alert("Hello from Livesite!");
  console.log("Button clicked!");
}
  
// Log a welcome message
console.log("Welcome to the Livesite editor!");`);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error('Please enter a title for your snippet');
            return;
        }

        setIsSaving(true);
        try {
            const mockId = Math.random().toString(36).substring(2, 15);
            toast.success('Snippet created successfully!');
        } catch (error) {
            toast.error('Failed to save snippet. Please try again.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">
            <Toaster />
            <div className="bg-slate-800 text-white p-4 flex items-center justify-between shadow-md">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-semibold bg-transparent border-none outline-none text-white w-1/3"
                    placeholder="Enter snippet title"
                />
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
                    >
                        <Save size={16} />
                        <span>{isSaving ? 'Saving...' : 'Save Snippet'}</span>
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6">
                <div className="lg:w-1/2">
                    <Tabs defaultValue="html" className="w-full">
                        <TabsList className="w-full bg-slate-700 text-white rounded-t-lg">
                            <TabsTrigger
                                value="html"
                                className="flex-1 data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                            >
                                HTML
                            </TabsTrigger>
                            <TabsTrigger
                                value="css"
                                className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                            >
                                CSS
                            </TabsTrigger>
                            <TabsTrigger
                                value="js"
                                className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                            >
                                JS
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="html" className="mt-0">
                            <CodeEditor language="html" value={html} onChange={setHtml} />
                        </TabsContent>
                        <TabsContent value="css" className="mt-0">
                            <CodeEditor language="css" value={css} onChange={setCss} />
                        </TabsContent>
                        <TabsContent value="js" className="mt-0">
                            <CodeEditor language="javascript" value={js} onChange={setJs} />
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="lg:w-1/2">
                    <LivePreview html={html} css={css} js={js} />
                </div>
            </div>
        </div>
    );
}