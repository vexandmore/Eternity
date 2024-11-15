
let operators: string[] = ['+', '-', '*', '/'];

export function makeMessage(parse_input: string, e: SyntaxError): string {
    if (e.toString().includes("Unexpected end of expression")) {
        let lastSymbol = parse_input[parse_input.length - 1];
        if (lastSymbol == '(') {
            return 'Missing )';
        } else if (operators.includes(lastSymbol)) {
            return `Need something on both sides of ${lastSymbol}`;
        } else {
            return(`Missing something after ${lastSymbol}`);
        }
    } else if (e.toString().includes("Value expected")) {
        // The error location is 1 undexed
        let errorLocation = (e as any).char - 1;
        if (operators.includes(parse_input[errorLocation - 1])) {
            return `Need something on both sides of ${parse_input[errorLocation - 1]}`;
        } else {
            return (`Expected a value instead of the ${parse_input[errorLocation]}`);
        }
    } else if (e.toString().includes("Parenthesis ) expected")) {
        return 'Missing a )';
    } else {
        return (e.toString());
    }
}