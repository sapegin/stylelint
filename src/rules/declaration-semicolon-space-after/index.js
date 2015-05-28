import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "declaration-semicolon-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after ";"`,
  rejectedAfter: () => `Unexpected space after ";"`,
  expectedAfterSingleLine: () => `Expected single space after ";" within single-line declaration block`,
  rejectedAfterSingleLine: () => `Unexpected space after ";" within single-line declaration block`,
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"} expectation
 */
export default function (expectation) {
  const check = whitespaceChecker(" ", expectation, messages)
  return function (css, result) {
    css.eachDecl(function (decl) {
      // Ignore last declaration if there's no trailing semicolon
      const parentRule = decl.parent
      if (!parentRule.semicolon && parentRule.last === decl) { return }

      const nextDecl = decl.next()
      if (!nextDecl) { return }
      check.after(nextDecl.toString(), -1, m => {
        return result.warn(m, { node: decl })
      }, parentRule.toString().slice("{"))
    })
  }
}