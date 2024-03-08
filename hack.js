export async function main(ns)  //Main Script
{
    const s = "foodnstuff";    //Target Server   [!!!   SETTING   !!!]   **Which server are we hacking??? (case sensitive)**
    var ab = ns.getServerMoneyAvailable(s); //Available Server Balance
    var cs = ns.getServerSecurityLevel(s);  //Current Server Security
    const mb = ns.getServerMaxMoney(s);   //Maximum Server Balance
    const ms = ns.getServerMinSecurityLevel(s);   //Minimum Server Security
    const ib = mb * 0.05;   //Ideal Server Balance   [!!!   SETTING   !!!]   **How full should the balance remain??? (0-1)**
    const is = ms + 20;  //Ideal Server Security   [!!!   SETTING   !!!]   **How many levels above minimum security before**
    const ibp = ((ib * 100) / mb);  //Ideal Server Balance as a percentage.     **we weaken instead of hacking the server??? (0-100)**
    const isp = ((is - ms) * 100) / (100 - ms); //Ideal Server Security as a percentage.
    const ba = "\x1b[30m";  //Black Color
    const re = "\x1b[31m";  //Red Color
    const gr = "\x1b[32m";  //Green Color
    const ye = "\x1b[33m";  //Yellow Color
    const bu = "\x1b[34m";  //Blue Color
    const ma = "\x1b[35m";  //Magenta Color
    const cy = "\x1b[36m";  //Cyan Color
    const wh = "\x1b[37m";  //White Color
    var fl = 0; //Initial Flash Value
    var l = 0;  //Loop Cycle Number
    function con(t, c)  //Recreates the local print function to allow for variable output color.
    {
        ns.print(c + t);    //Prints colorized text.
    }
    function r(wgoh, c) //Script for gathering server information and cleanly displaying it in the console.
    {
        function fu()  //Function to switch between return values each time it is called.
        {
            if (fl == 0)  //If flash equals 0...
            {
                fl = 1;  //then change it to 1..
                return re;  //and return re
            }
            else if (fl == 1)    //If flash equals 1...
            {
                fl = 0; //then change it to 0...
                return bu;  //and return bu
            }
        }
        function f(x)   //Function that adds commas to long numbers.
        {
            x = x.toString();
            var pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(x))
                x = x.replace(pattern, "$1,$2");
            return x;
        }
        var sb = ((ab * 100) / (mb));   //Calculates how full the server balance is as a percentage.
        var ss = ((cs - ms) * 100) / (100 - ms);    //Calculates how secure the server is as a percentage.
        function getBalCo() //Decides which output color is appropriate based on current server balance.
        {
            if (ab < ib)    //If server balance is less than ideal balance...
            {
                return re;  //then return color red.
            }
            else if (ab < (ib + 5)) //If server balance is less than ideal balance plus five...
            {
                return ye;  //then return color yellow.
            }
            else    //If none of the previous statements are true...
            {
                return gr;  //then return color green.
            }
        }
        function getSecCo() //Decides which output color is appropriate based on the servers current security level.
        {
            if (cs < is)    //If server security level is less than ideal server security...
            {
                return gr;  //then return color green.
            }
            else if (cs = is) //If server security level equals ideal server security...
            {
                return ye;  //then return color yellow.
            }
            else    //If none of the previous statements are true...
            {
                return gr;  //then return color green.
            }
        }
        con("---------------------------------------------------", fu()); //Prints a line across the console, color alternating red and blue.
        con("         ", fu());   //This is essential a page break.
        con("      Server Status:", ma)    //Prints "Server Status:", color magenta.
        con("         ", ba);   //This is essential a page break.
        con("         Loop Cycle: #" + f(l), cy);  //Prints the current loop cycle in the console, color cyan.
        con("         Operation: " + wgoh, c);  //Prints the last operation in console. Weaken, grow or hack in red, yellow or green color.
        con("         Balance Level: " + Math.round(sb) + "%, $" + f(Math.round(ab)), getBalCo());  //Prints complete and rounded server balance information to console with a variable color to display status.
        con("         Security Level: " + Math.round(ss) + "%, " + f(Math.round(1000 * cs / 1000)), getSecCo()); //Prints complete and rounded security information to console with a variable color to display status.
        con("         ", ba);   //This is essential a page break.
        con("      Current Settings:", ma)  //Prints "Current Settings:", color magenta.
        con("         ", ba);   //This is essential a page break.
        con("         Target Server: " + s, cy);   //Prints the target server in console, color cyan.
        con("         Ideal Server Balance: " + Math.round(ibp) + "%, $" + f(Math.round(ib)), ye);   //Prints complete and rounded ideal server balance to console, color yellow.
        con("         Ideal Server Security: " + Math.round(isp) + "%, " + f(Math.round(1000 * is / 1000)), ye); //Prints complete and rounded ideal server security to console, color yellow.
        con("         ", ba);   //This is essential a page break.
        con("---------------------------------------------------", fu()); //Prints a line across the console, color alternating red and blue.
    }
    while (true)    //Infinite Loop
    {
        var ab = ns.getServerMoneyAvailable(s); //Available Balance         **I had to redefine these values inside the**
        var cs = ns.getServerSecurityLevel(s);  //Current Security          **loop so that it would be updated each cycle.**
        if (cs > is)    //If server security level is greater than ideal server security level...
        {
            r("Weaken", re);    //Calls for the r function above. Telling the function that our last operation was the weaken command and that it should display as red.
            await ns.weaken(s); //then run the weaken command on the server.
        }
        else if (ab < ib)   //If not and if server available balance is less than ideal server balance...
        {
            r("Grow", ye);  //Calls for the r function above. Telling the function that our last operation was the grow command and that it should display as yellow.
            await ns.grow(s);   //then run the grow command on the server.
        }
        else    //If none of the previous statements are true...
        {
            r("Hack", gr);  //Calls for the r function above. Telling the function that our last operation was the hack command and that it should display as green.
            await ns.hack(s);   //then run the hack command on the server.
        }
        l = l + 1;  //Updates the loop counter.
    }
}
