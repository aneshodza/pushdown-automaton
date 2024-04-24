# Real use-cases
In this folder you can find tests of real applications of pushdown automata.

## Balanced parantheses
This pushdown automaton can check if the input word has balanced parantheses. This is how the language is defined:
$$`
L = \{ w \mid w \text{ is a string of balanced parentheses} \}
`$$
**Accepted words that are tested:**
```
-> (()())
-> ()()()
-> ((()))
-> ()(()())
```

**Not accepted words that are tested:**
```
-> (()()
-> ())
-> ((())
-> )()()
```
