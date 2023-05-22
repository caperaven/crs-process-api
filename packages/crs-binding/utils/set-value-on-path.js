function f(t,n,l){if(t==null||(n||"").length==0)return;const e=n.split("."),r=e.pop();for(const s of e)t=t[s]||={};t[r]=l}export{f as setValueOnPath};
