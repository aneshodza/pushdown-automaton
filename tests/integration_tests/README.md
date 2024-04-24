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

$$`
\text{The automaton can be defined as such:} \newline
M = (\{q_1, q_2\}, \{(, )\}, \{\$, 1, L\}, \delta, q_1, \$, F)
`$$

$$`
\text{Following transition functions are defined:} \newline
\delta(q_1, "(", "\$") = \{(q_1, "\$L")\} \newline
\delta(q_1, "(", "L") = \{(q_1, "L1")\} \newline
\delta(q_1, "(", "1") = \{(q_1, "11")\} \newline
\delta(q_1, ")", "1") = \{(q_1, \epsilon)\} \newline
\delta(q_1, ")", "L") = \{(q_2, \epsilon)\} \newline
\delta(q_2, "(", "\$") = \{(q_1, "\$L")\}
`$$


