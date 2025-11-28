import React from 'react';

const BaziResult = ({ reading, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto animate-pulse mt-10">
        <div className="flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
          <span className="ml-3 text-gray-800 text-lg">AI 正在推演八字命盘…</span>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-black/10 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!reading) return null;

  return (
    <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto mt-10 animate-fadeIn">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 tracking-wide">命理推演结果</p>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">生辰八字解读</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto rounded-full mt-3" />
      </div>
      <div className="glass-effect rounded-xl p-6 bg-white/80">
        <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">{reading}</p>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">
        * 本解读基于用户提供的出生信息，由 AI 推演，仅供参考。
      </p>
    </div>
  );
};

export default BaziResult;


