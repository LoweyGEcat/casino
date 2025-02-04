import React from 'react';
import { Player } from '../../../hooks/use-tongit-game';
import { Card as CardType } from '../../../utils/card-utils';
import { Card } from './Card';


export function DiscardPile({ topCard, onDraw, disabled, canDraw }) {
  if (!topCard) {
    return (
      <button 
        className=" w-16 2xl:w-20 h-24 2xl:h-28 bg-gray-300 border border-black rounded-lg shadow-md flex items-center justify-center"
        disabled={true}
      >
        Empty
      </button>
    );
  }

  return (
    <button 
      className={`p-0 bg-transparent hover:bg-transparent ${!canDraw ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onDraw}
      disabled={disabled || !canDraw}
    >
      <Card cardSize={'w-16 2xl:w-20 h-24 2xl:h-28 p-3 text-2xl'} card={topCard} />
    </button>
  );
}