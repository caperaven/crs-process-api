function r(t){if(t==null)return;if(t.endsWith("/"))return t;const n=t.split("/");return n.pop(),`${n.join("/")}/`}export{r as getPathOfFile};
