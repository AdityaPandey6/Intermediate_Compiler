int main() {
  int a = 2;
  int b = 3;
  int c = 4;
  int d = 5;
  int x = (a + b) * (c + d) - a * b + c / d;
  int y = a + b * c - d / (a + 1);
  return x + y;
}