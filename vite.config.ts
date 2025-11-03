import random

def create_board(size, bombs):
    board = [[' ' for _ in range(size)] for _ in range(size)]
    bomb_positions = random.sample(range(size * size), bombs)
    for pos in bomb_positions:
        row, col = divmod(pos, size)
        board[row][col] = 'B'
    return board

def print_board(board, revealed):
    size = len(board)
    print("   " + " ".join(str(i) for i in range(size)))
    for r in range(size):
        row_str = f"{r} |"
        for c in range(size):
            if revealed[r][c]:
                row_str += board[r][c] + "|"
            else:
                row_str += " |"
        print(row_str)
    print()

def count_adjacent_bombs(board, row, col):
    size = len(board)
    count = 0
    for i in range(max(0, row - 1), min(size, row + 2)):
        for j in range(max(0, col - 1), min(size, col + 2)):
            if board[i][j] == 'B':
                count += 1
    return count

def reveal(board, revealed, row, col):
    if revealed[row][col]:
        return
    revealed[row][col] = True
    if board[row][col] == 'B':
        return
    bombs_around = count_adjacent_bombs(board, row, col)
    board[row][col] = str(bombs_around)
    if bombs_around == 0:
        for i in range(max(0, row - 1), min(len(board), row + 2)):
            for j in range(max(0, col - 1), min(len(board), col + 2)):
                if not revealed[i][j]:
                    reveal(board, revealed, i, j)

def play_minesweeper(size=5, bombs=5):
    board = create_board(size, bombs)
    revealed = [[False for _ in range(size)] for _ in range(size)]

    while True:
        print_board(board, revealed)
        try:
            row = int(input("Enter row: "))
            col = int(input("Enter column: "))
        except ValueError:
            print("Please enter valid numbers.")
            continue

        if row < 0 or row >= size or col < 0 or col >= size:
            print("Out of bounds!")
            continue

        if board[row][col] == 'B':
            revealed[row][col] = True
            print_board(board, revealed)
            print("💥 Boom! You hit a bomb. Game over.")
            break

        reveal(board, revealed, row, col)

        # Check win
        safe_cells = sum(row.count(False) for row in revealed)
        if safe_cells == bombs:
            print_board(board, revealed)
            print("🎉 You win! All safe cells revealed.")
            break

if __name__ == "__main__":
    play_minesweeer()
