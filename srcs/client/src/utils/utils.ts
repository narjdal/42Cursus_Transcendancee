const getCookies = (key:string) => {
    const cookie = document.cookie.split(';').filter((x) => x.trim().split('=')[0] === key)[0];
    // const cookie2 = document.cookie
    // console.log("INSIDE GET COOKIES HAHA " + cookie + " || " + cookie2);
    if (!cookie)
   { return '';}
   return cookie.split('=')[1];

}

export {
    getCookies
}