int main() {
  int x = 5;
  int y = 3;
  int sum = x + y;
  int prod = x * y;
  int diff = prod - sum;
  int quotient = prod / y;
  int mod = prod % y;
  if (diff > 5) {
    sum = sum + 1;
  } else {
    sum = sum - 1;
  }
  int i = 0;
  int total = 0;
  for (i = 0; i < 3; i = i + 1) {
    total = total + i;
  }
  return total + sum + quotient + mod;
}