/**
 * Receives any number of arguments and prints their values to stdout, using the
 * tostring function to convert each argument to a string. print is not intended
 * for formatted output, but only as a quick way to show a value, for instance
 * for debugging. For complete control over the output, use string.format and
 * io.write.
 */
declare function print(out: any): void;

declare namespace string {
    /**
     * Returns a string that is the concatenation of n copies of the string s.
     */
    function rep(wtf:LuaTable): string;
}