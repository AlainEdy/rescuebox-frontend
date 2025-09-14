import React from 'react';
export default function Loading(){
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div style={{width:120,height:120,margin:'0 auto'}} className="mb-4">
          <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="var(--accent)" strokeWidth="8" fill="none" strokeDasharray="62.8" strokeLinecap="round"/></svg>
        </div>
        <h1 className="text-xl font-semibold">RescueBox</h1>
        <p className="text-sm text-gray-500">Salvando comida, una caja a la vez.</p>
      </div>
    </div>
  );
}
