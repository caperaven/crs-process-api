const TokenTypes = Object.freeze({
  WORD: "word",
  LITERAL: "literal",
  FUNCTION: "function",
  PROPERTY: "property",
  OBJECT: "object",
  KEYWORD: "keyword",
  OPERATOR: "operator",
  NUMBER: "number",
  SPACE: "space",
  STRING: "string"
});
function tokenize(exp, isLiteral) {
  const result = [];
  let word = [];
  let i = 0;
  function step(type, value) {
    if (word.length > 0) {
      const value2 = word.join("");
      pushWord(value2);
    }
    result.push({ type, value });
  }
  function pushWord(value) {
    let wordType = TokenTypes.WORD;
    if (keywords.indexOf(value) != -1) {
      wordType = TokenTypes.KEYWORD;
    }
    if (isNaN(Number(value)) == false) {
      wordType = TokenTypes.NUMBER;
    }
    result.push({ type: wordType, value });
    word.length = 0;
  }
  for (i; i < exp.length; i++) {
    const char = exp[i];
    if (char == " ") {
      step(TokenTypes.SPACE, " ");
      continue;
    }
    if (char == "`") {
      step(TokenTypes.LITERAL, "`");
      continue;
    }
    if (char == "$") {
      if (exp[i + 1] == "{") {
        step(TokenTypes.KEYWORD, "${");
        i++;
        continue;
      }
    }
    if (char == "'" || char == '"') {
      const lastIndex = i + exp.length - i;
      let hasLiteral = false;
      if (exp[i + 1] == void 0) {
        step(TokenTypes.STRING, char);
        break;
      }
      let j = i + 1;
      for (j; j < lastIndex; j++) {
        if (exp[j] == "$" && exp[j + 1] == "{") {
          hasLiteral = true;
          break;
        }
        if (exp[j] == char) {
          const value = exp.substring(i, j + 1);
          step(TokenTypes.STRING, value);
          break;
        }
      }
      if (hasLiteral == true) {
        step(TokenTypes.STRING, char);
      } else {
        i = j;
      }
      continue;
    }
    if (keywords.indexOf(char) != -1) {
      step(TokenTypes.KEYWORD, char);
      continue;
    }
    if (operatorStart.indexOf(char) != -1) {
      for (let j = i; j < i + 4; j++) {
        const charNext = exp[j];
        if (operatorStart.indexOf(charNext) == -1) {
          const value = exp.substring(i, j);
          step(TokenTypes.OPERATOR, value);
          i = j - 1;
          break;
        }
      }
      continue;
    }
    word.push(char);
  }
  if (word.length > 0) {
    pushWord(word.join(""));
  }
  return postProcessTokens(result, isLiteral);
}
function postProcessTokens(tokens, isLiteral) {
  if (tokens.length == 1 && tokens[0].type == TokenTypes.WORD) {
    tokens[0].type = TokenTypes.PROPERTY;
    return tokens;
  }
  let state = [];
  let i = 0;
  while (tokens[i] != void 0) {
    const token = tokens[i];
    const currentState = state.length == 0 ? "none" : state[state.length - 1];
    const index = token.value.indexOf(".");
    if (token.type == TokenTypes.WORD) {
      if (currentState == TokenTypes.LITERAL) {
        if (token.value[0] == "." && tokens[i + 1].value == "(") {
          token.type = TokenTypes.FUNCTION;
          i++;
          continue;
        }
        token.type = TokenTypes.PROPERTY;
      } else if (index != -1) {
        if (tokens[i - 1]?.value === ")" && index === 0) {
          token.type = TokenTypes.FUNCTION;
        } else {
          token.type = TokenTypes.PROPERTY;
        }
      } else if (isOperator(tokens[i + 1]) || isOperator(tokens[i + 2])) {
        if (isLiteral !== true && currentState !== TokenTypes.OBJECT) {
          token.type = TokenTypes.PROPERTY;
        }
      } else if (isLiteral !== true && isOperator(tokens[i - 1]) || isOperator(tokens[i - 2])) {
        if (currentState !== TokenTypes.OBJECT) {
          token.type = TokenTypes.PROPERTY;
        }
      } else if (i === 0 && tokens[i + 1]?.value === "(") {
        token.type = TokenTypes.PROPERTY;
      }
    }
    if (token.type == TokenTypes.KEYWORD && token.value == "(" && (tokens[i - 1] && tokens[i - 1].type == TokenTypes.PROPERTY && tokens[i - 1].value[0] != "$")) {
      const path = tokens[i - 1].value;
      if (path.indexOf(".") == -1) {
        tokens[i - 1].type = TokenTypes.FUNCTION;
      } else {
        let dotIndex = path.length - 1;
        for (let i2 = path.length - 1; i2 >= 0; i2--) {
          if (path[i2] == ".") {
            dotIndex = i2;
            break;
          }
        }
        if (dotIndex > 0) {
          const property = path.substring(0, dotIndex);
          const fnName = path.substring(dotIndex, path.length);
          tokens[i - 1].value = property;
          tokens.splice(i, 0, { type: TokenTypes.FUNCTION, value: fnName });
          i++;
        } else {
          tokens[i - 1].type = TokenTypes.FUNCTION;
        }
      }
    }
    if (token.value == "${") {
      state.push(TokenTypes.LITERAL);
    } else if (token.value == "{") {
      state.push(TokenTypes.OBJECT);
    } else if (token.value == "}") {
      state.pop();
    }
    i++;
  }
  if (tokens[0].type === TokenTypes.FUNCTION) {
    tokens[0].type = TokenTypes.PROPERTY;
  }
  return tokens;
}
function isOperator(token) {
  if (token == null)
    return false;
  return token.type == TokenTypes.OPERATOR;
}
const operatorStart = ["=", "!", "<", ">", "+", "-", "*", "/", "&", "|", "?", ":"];
const keywords = ["{", "}", "(", ")", ",", "true", "false", "null", "undefined", "[]"];
export {
  tokenize
};
