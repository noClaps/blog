def collatz(n: int):  # make collatz function
    while n != 1:  # tell code to keep running until it reaches 1
        if n % 2:  # if number is odd, multiply by 3 and add 1
            n = n * 3 + 1
        else:  # else, if number is even, halve it
            n //= 2
        print(n)  # output number onto screen


num = int(input("Enter a number to test: "))  # ask user for number to test
collatz(num)  # run the collatz function with the number you type in
