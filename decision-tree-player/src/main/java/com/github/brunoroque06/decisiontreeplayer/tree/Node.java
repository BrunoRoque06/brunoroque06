package com.github.brunoroque06.decisiontreeplayer.tree;

import com.github.brunoroque06.decisiontreeplayer.board.Board;
import com.github.brunoroque06.decisiontreeplayer.board.Square;
import com.github.brunoroque06.decisiontreeplayer.board.State;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Node {
  private final Board board;
  private final List<Node> leaves;
  private Square move;
  private int minimax;
  private int depth;

  Node(final Board board) {
    this.board = board;
    minimax = 0;
    depth = 0;
    leaves = new ArrayList<>();
  }

  Node(final Board board, final Square move, final Node parent) {
    this(board);
    this.move = move;
    depth = parent.getDepth() + 1;
    parent.addLeave(this);
  }

  private void addLeave(final Node node) {
    leaves.add(node);
  }

  int getDepth() {
    return depth;
  }

  State getState() {
    return board.getStatus();
  }

  List<Square> getPossibleMoves() {
    return board.estimateEmptySquares();
  }

  int getMinimax() {
    return minimax;
  }

  Node getBestLeaf() {
    return leaves.stream().filter(e -> e.getMinimax() == minimax).findFirst().orElse(null);
  }

  void estimateMinimax(final State rootState) {
    int evaluation = -1;
    if (isGameWon(rootState)) {
      evaluation = 1;
    } else if (isGameStillBeingPlayed()) {
      evaluation = 0;
    }
    minimax = evaluation;
  }

  private boolean isGameWon(final State rootState) {
    final State nodeState = board.getStatus();
    return nodeState.hasXWon() && rootState.isXTurn() || nodeState.hasOWon() && rootState.isOTurn();
  }

  private boolean isGameStillBeingPlayed() {
    final State nodeState = board.getStatus();
    return nodeState.isGameDrawn() || nodeState.isXTurn() || nodeState.isOTurn();
  }

  void updateMinimax() {
    final List<Integer> leafsEvaluation = new ArrayList<>();

    for (final Node leaf : leaves) {
      leafsEvaluation.add(leaf.getMinimax());
    }

    minimax = isDepthEven() ? Collections.max(leafsEvaluation) : Collections.min(leafsEvaluation);
  }

  Board cloneBoard() {
    return board.cloneBoard();
  }

  boolean isGameWonOrDrawn() {
    return board.getStatus().isGameWonOrDrawn();
  }

  private boolean isDepthEven() {
    return depth % 2 == 0;
  }

  boolean isBoardEmpty() {
    return board.isBoardEmpty();
  }

  Square getMove() {
    return move;
  }
}