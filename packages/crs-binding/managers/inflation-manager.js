class l{async register(r,o,n="context"){const t=await crs.binding.expression.inflationFactory(o,n);crs.binding.inflation.store.add(r,o,t)}async unregister(r){crs.binding.inflation.store.remove(r)}async get(r,o,n){const{template:t,fn:c}=crs.binding.inflation.store.get(r);n=a(n,o.length,t);for(let f=0;f<o.length;f++){const g=n[f];c(g,o[f])}return n}}function a(i,r,o){if(i=Array.from(i),i.length>r)for(let n=i.length-1;n>=r;n--)i[n].remove();else if(i.length<r){let n=i[0];n==null&&(o.nodeName=="TEMPLATE"?n=o.content.cloneNode(!0).firstElementChild:n=o);for(let t=i.length;t<r;t++)i.push(n.cloneNode(!0))}return i}crs.binding.inflation.manager=new l;export{l as InflationManager};
