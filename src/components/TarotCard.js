import React from 'react';

const TarotCard = ({ card, isFlipped, onClick }) => {
  return (
    <div 
      className="card-flip cursor-pointer"
      onClick={onClick}
      style={{ width: 280, height: 420 }}
    >
      <div className={`card-inner ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* 牌背（默认可见）*/}
        <div className="card-front glass-effect p-1 flex flex-col items-center justify-center mx-auto" style={{ width: 260, height: 400 }}>
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img src="/tarot-back.png" alt="塔罗背面" className="w-full h-full object-cover" />
          </div>
        </div>
        
        {/* 牌面（翻转后可见）*/}
        <div className="card-back glass-effect p-3 flex flex-col items-center justify-center mx-auto" style={{ width: 260, height: 400 }}>
          <div className="w-full rounded-lg mb-3 overflow-hidden flex items-center justify-center" style={{ height: 320 }}>
            <img 
              src={card.image} 
              alt={card.name}
              className={`w-auto h-full object-contain ${card.reversed ? 'rotate-180' : ''}`}
            />
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">第{card.order}张牌</div>
            <h3 className="text-gray-800 text-lg font-semibold">{card.name}</h3>
            <div className="text-gray-600 text-sm">{card.reversed ? '逆位' : '正位'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotCard;
