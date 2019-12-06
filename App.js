import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import Constants from './Constants';
import Cell from './components/Cell'

export default class App extends Component {
  constructor(props) {
    super(props);

    this.boardWidth = Constants.CELL_SIZE * Constants.BOARD_SIZE;
    this.grid = Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, index) => {
      return Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, index) => {
        return null;
      });
    });
  }

  onDie = () => {
    Alert.alert("Ya dun goofed!");
    for (let i = 0; i < Constants.BOARD_SIZE; i++) {
      for (let j = 0; j < Constants.BOARD_SIZE; j++) {
        this.grid[i][j].revealWithoutCallback();
      }
    }
  }

  revealNeighbors = (x, y) => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if ((i != 0 || j != 0) && x + i >= 0 && x + i <= Constants.BOARD_SIZE - 1 && y + j >= 0 && y + j <= Constants.BOARD_SIZE - 1) {
          this.grid[x+i][y+j].onReveal(false);
        }
      }
    }
  }

  onReveal = (x, y) => {
    let neighbors = 0;
    for(let i=-1; i<=1; i++) {
      for(let j=-1; j<=1; j++) {
        if (x + i >= 0 && x + i <= Constants.BOARD_SIZE - 1 && y + j >= 0 && y + j <= Constants.BOARD_SIZE - 1) {
          if(this.grid[x+i][y+j].state.isMine) {
            neighbors++;
          }
        }
      }
    }
    if(neighbors){
      this.grid[x][y].setState({
        neighbors: neighbors
      });
    } else {
      this.revealNeighbors(x, y);
    }
  }

  renderBoard = () => {
    return Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, rowIndex) => {
      let cellList = Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, colIndex) => {
        return  <Cell 
                  onReveal={this.onReveal}
                  onDie={this.onDie}
                  key={colIndex} 
                  width={Constants.CELL_SIZE} 
                  height={Constants.CELL_SIZE} 
                  x={colIndex} 
                  y={rowIndex} 
                  ref={(ref) => {this.grid[colIndex][rowIndex] = ref}}/>
      });

      return <View key={rowIndex} style={{ width: this.boardWidth, height: Constants.CELL_SIZE, flexDirection: 'row'}}>
        {cellList}
      </View>
    });
  }

  resetGame = () => {
    for(let i=0; i<Constants.BOARD_SIZE; i++) {
      for(let j=0; j<Constants.BOARD_SIZE; j++) {
        this.grid[i][j].reset();
      }
    }
  } 
  
  render() {
    
    return (
      <View style={styles.container}>
        <View style={{width: this.boardWidth, height: this.boardWidth, backgroundColor: '#888888', flexDirection: 'column'}}>
          {this.renderBoard()}
        </View>
        <Button title="New Game" onPress={this.resetGame} />
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'burlywood'
  },
});
