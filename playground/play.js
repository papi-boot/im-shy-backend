const regexFind = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;
const thisString = "@JasonEvans22";
console.log(thisString.match(regexFind))