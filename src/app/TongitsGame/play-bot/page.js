"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTongitGame } from "../../../hooks/use-tongit-game";
import { PlayerHand } from "./PlayerHand";
import { Deck } from "./Deck";
import { DiscardPile } from "./DiscardPile";
import { GameBoard } from "./GameBoard";
import { ActivityLog } from "./ActivityLog";
import { MeldedCards } from "./MeldedCards";
import { motion, AnimatePresence } from "framer-motion";
import { isValidMeld } from "../../../utils/card-utils";
import NetworkStatus from "@/app/components/NetworkStatus";
import PercentageLoader from "@/app/components/PercentageLoad";

export default function TongitGame() {
  const [scale, setScale] = useState(1);
  const [gameMode, setGameMode] = useState("Bot");
  const [selectedSapawTarget, setSelectedSapawTarget] = useState(null);
  const {
    gameState,
    gameActions,
    drawCard,
    discardCard,
    meldCards,
    sapaw,
    checkTongits,
    updateSelectedCardIndices,
    botTurn,
    isProcessingBotTurn,
    isDeckEmpty,
    callDraw,
  } = useTongitGame(gameMode);
  const [sapawTarget, setSapawTarget] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handleCardClick = useCallback(
    (index) => {
      if (
        gameState &&
        !gameState.gameEnded &&
        gameState.currentPlayerIndex === 0
      ) {
        const newSelectedIndices = gameState.selectedCardIndices.includes(index)
          ? gameState.selectedCardIndices.filter((i) => i !== index)
          : [...gameState.selectedCardIndices, index];
        updateSelectedCardIndices(newSelectedIndices);
      }
    },
    [gameState, updateSelectedCardIndices]
  );

  const handleDiscard = useCallback(() => {
    if (
      gameState &&
      gameState.currentPlayerIndex === 0 &&
      gameState.selectedCardIndices.length === 1 &&
      !gameState.gameEnded
    ) {
      discardCard(gameState.selectedCardIndices[0]);
    }
  }, [gameState, discardCard]);

  const handleMeld = useCallback(() => {
    if (
      gameState &&
      gameState.currentPlayerIndex === 0 &&
      gameState.selectedCardIndices.length >= 3 &&
      !gameState.gameEnded
    ) {
      meldCards(gameState.selectedCardIndices);
      setStatusMessage("Meld successful. You can continue your turn.");
    }
  }, [gameState, meldCards, setStatusMessage]);

  const handleSapaw = useCallback(() => {
    if (
      gameState &&
      gameState.currentPlayerIndex === 0 &&
      sapawTarget &&
      gameState.selectedCardIndices.length > 0 &&
      !gameState.gameEnded
    ) {
      sapaw(
        sapawTarget.playerIndex,
        sapawTarget.meldIndex,
        gameState.selectedCardIndices
      );
      setSapawTarget(null);
      setSelectedSapawTarget(null);
      setStatusMessage("Sapaw successful. You can continue your turn.");
    }
  }, [
    gameState,
    sapawTarget,
    sapaw,
    setSapawTarget,
    setStatusMessage,
    setSelectedSapawTarget,
  ]);

  const handleCallDraw = useCallback(() => {
    if (
      gameState &&
      gameState.currentPlayerIndex === 0 &&
      !gameState.gameEnded &&
      gameState.players[0].exposedMelds.length > 0 &&
      !gameState.hasDrawnThisTurn
    ) {
      callDraw();
    }
  }, [gameState, callDraw]);

  const canDrawFromDiscard = useCallback(() => {
    if (!gameState || gameState.discardPile.length === 0) return false;
    const topDiscardCard =
      gameState.discardPile[gameState.discardPile.length - 1];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    for (let i = 0; i < currentPlayer.hand.length; i++) {
      for (let j = i + 1; j < currentPlayer.hand.length; j++) {
        if (
          isValidMeld([
            topDiscardCard,
            currentPlayer.hand[i],
            currentPlayer.hand[j],
          ])
        ) {
          return true;
        }
      }
    }

    for (const meld of currentPlayer.exposedMelds) {
      if (isValidMeld([...meld, topDiscardCard])) {
        return true;
      }
    }

    return false;
  }, [gameState]);

  useEffect(() => {
    if (
      gameState &&
      gameState.currentPlayerIndex !== 0 &&
      !isProcessingBotTurn &&
      !gameState.gameEnded
    ) {
      const timer = setTimeout(() => {
        botTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, botTurn, isProcessingBotTurn]);

  useEffect(() => {
    if (gameState && isDeckEmpty() && !gameState.gameEnded) {
      callDraw();
    }
  }, [gameState, isDeckEmpty, callDraw]);

  if (!gameState) {
    return (
      <div>
        <PercentageLoader />
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isPlayerTurn = gameState.currentPlayerIndex === 0;

  const animateClick = () => {
    setScale(0.99);
    setTimeout(() => {
      setScale(1);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 min-h-screen bg-[url('/image/TableBot.svg')]  bg-no-repeat bg-cover bg-center relative">
      <div className="absolute w-screen h-16 top-0  bg-gradient-to-r from-[#9AD0C2] rgba(112,35,28,0.8)  rgba(91,36,36,1) via-[#583332] to-[#4E6A63]">
        <div className="flex flex-row h-full w-full justify-between">
          <button>
            <img
              onClick={animateClick}
              src="/image/sideBarButton.svg"
              alt="My image"
              className="w-full h-full"
              style={{
                transform: `scale(${scale})`,
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </button>
          <NetworkStatus />
        </div>
      </div>
      <div className="flex w-full max-w-7xl gap-4">
        <div className="w-1/4">
          <div className="h-[calc(100vh-8rem)]">
            <div className="p-4 h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-2">Activity Log</h2>
              <div className="flex-grow overflow-y-auto">
                <ActivityLog activities={gameActions} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                {gameState.gameEnded
                  ? "Game Over"
                  : isPlayerTurn
                  ? "Your Turn"
                  : `${currentPlayer.name}'s Turn`}
              </h2>
              {gameState.gameEnded ? (
                <div>
                  <p className="font-bold">Final Scores:</p>
                  {gameState.players.map((player) => (
                    <div key={player.id}>
                      <p>
                        {player.name}: {player.score} points
                      </p>
                      {player.secretMelds && player.secretMelds.length > 0 && (
                        <div>
                          <p>Secret Melds:</p>
                          {player.secretMelds.map((meld, index) => (
                            <div key={index} className="flex space-x-1">
                              {meld.map((card, cardIndex) => (
                                <div key={cardIndex} card={card} small />
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <p className="mt-2 font-bold">
                    Winner: {gameState.winner?.name}
                  </p>
                </div>
              ) : gameState.hasDrawnThisTurn ? (
                <p className="text-sm text-gray-600">
                  {isPlayerTurn ? "You have" : `${currentPlayer.name} has`}{" "}
                  drawn a card.
                  {isPlayerTurn ? "You can" : "They can"} meld, sapaw, or
                  discard to end the turn.
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  {isPlayerTurn
                    ? "Draw a card"
                    : `${currentPlayer.name} needs to draw a card`}{" "}
                  from the deck or discard pile to start the turn.
                </p>
              )}
              {statusMessage && (
                <p className="text-sm text-blue-600 mt-2">{statusMessage}</p>
              )}
            </div>
          </div>
          <div>
            <div className="p-4 flex justify-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Deck
                  cardsLeft={gameState.deck.length}
                  onDraw={() =>
                    isPlayerTurn && !gameState.gameEnded && drawCard(false)
                  }
                  disabled={
                    gameState.hasDrawnThisTurn ||
                    !isPlayerTurn ||
                    gameState.gameEnded
                  }
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DiscardPile
                  topCard={
                    gameState.discardPile[gameState.discardPile.length - 1] ||
                    null
                  }
                  onDraw={() =>
                    isPlayerTurn && !gameState.gameEnded && drawCard(true)
                  }
                  disabled={
                    gameState.hasDrawnThisTurn ||
                    !isPlayerTurn ||
                    gameState.gameEnded ||
                    !canDrawFromDiscard()
                  }
                  canDraw={canDrawFromDiscard()}
                />
              </motion.div>
            </div>
          </div>
          <div>
            <div className="p-4">
              <PlayerHand
                hand={gameState.players[0].hand}
                onCardClick={handleCardClick}
                selectedIndices={gameState.selectedCardIndices}
                isCurrentPlayer={isPlayerTurn && !gameState.gameEnded}
              />
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <div className="h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">Melded Cards</h2>
              <MeldedCards
                players={gameState.players}
                onSapawSelect={(target) => {
                  setSapawTarget(target);
                  setSelectedSapawTarget(target);
                }}
                currentPlayerIndex={gameState.currentPlayerIndex}
                selectedSapawTarget={selectedSapawTarget}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="pl-10 flex space-x-2 w-screen">
          <button
          onClick={handleMeld}
            disabled={
              !isPlayerTurn ||
              gameState.selectedCardIndices.length !== 1 ||
              !gameState.hasDrawnThisTurn ||
              gameState.gameEnded
            }
          >
                        <img
              onClick={animateClick}
              src="/image/dropButton.svg"
              alt="My image"
              className="w-[110px] h-full"
              style={{
                transform: `scale(${scale})`,
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </button>
          <button
            onClick={handleDiscard}
            disabled={
              !isPlayerTurn ||
              gameState.selectedCardIndices.length < 3 ||
              !gameState.hasDrawnThisTurn ||
              gameState.gameEnded
            }
          >
            <img
              onClick={animateClick}
              src="/image/dumpButton.svg"
              alt="My image"
              className="w-[110px] h-full"
              style={{
                transform: `scale(${scale})`,
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </button>
          <button
            onClick={handleSapaw}
            disabled={
              !isPlayerTurn ||
              !sapawTarget ||
              gameState.selectedCardIndices.length === 0 ||
              !gameState.hasDrawnThisTurn ||
              gameState.gameEnded
            }
          >
            <svg width="100" height="90">
              <text
                x="10"
                y="50"
                fontFamily="Jaro"
                fontSize="30"
                fill="white"
                stroke="black"
                strokeWidth="1"
                letterSpacing="-2"
              >
                SAPAW
              </text>
            </svg>
          </button>
          <button
            onClick={handleCallDraw}
            disabled={
              !isPlayerTurn ||
              currentPlayer.exposedMelds.length === 0 ||
              gameState.hasDrawnThisTurn ||
              gameState.gameEnded ||
              currentPlayer.turnsPlayed <= 1 ||
              currentPlayer.isSapawed
            }
          >
            <svg width="100" height="90">
              <text
                x="10"
                y="50"
                fontFamily="Jaro"
                fontSize="30"
                fill="white"
                stroke="black"
                strokeWidth="1"
                letterSpacing="-2"
              >
                DRAW
              </text>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
