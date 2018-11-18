package com.github.brunoroque06.decisiontreeplayer.board;

public class Square {
  private final int row;
  private final int col;

  public Square(final int row, final int col) {
    this.row = row;
    this.col = col;
  }

  public int getRow() {
    return row;
  }

  public int getCol() {
    return col;
  }
}
