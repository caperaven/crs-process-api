class g{static async perform(e,a,t,n){await this[e.action](e,a,t,n)}static async load(e,a,t,n){if(await crs.process.getValue(e.args.dialog,a,t,n)==!0){const l=await w(e);let o=[];for(const s of l){const c=await p.blob(s),u=await d(s.name);o.push({name:u.name,ext:u.ext,type:s.type,size:s.size,value:c})}return e.args.target!=null&&await crs.process.setValue(e.args.target,o,a,t,n),o}else{const l=await y(e,a,t,n);return e.args.target!=null&&await crs.process.setValue(e.args.target,l,a,t,n),l}}static async save(e,a,t,n){const r=await crs.process.getValue(e.args.details,a,t,n);let l=document.createElement("a");l.style.display="none",document.body.appendChild(l);for(let o of r){let s=new Blob([o.value],{type:o.type}),c=window.URL.createObjectURL(s);l.href=c,l.download=`${o.name}.${o.ext}`,l.click(),window.URL.revokeObjectURL(c),c=null,s=null}l.parentElement.removeChild(l),l=null}static async save_canvas(e,a,t,n){const r=await crs.dom.get_element(e.args.source),l=await crs.process.getValue(e.args.name,a,t,n)||"image",o=r.toDataURL("image/png");let s=document.createElement("a");s.style.display="none",document.body.appendChild(s),s.href=o.replace("image/png","image/octet-stream"),s.download=`${l}.png`,s.click(),s.parentElement.removeChild(s),s=null}static async enable_dropzone(e,a,t,n){const r=await crs.dom.get_element(e.args.element,a,t,n),l=await crs.process.getValue(e.args.handler,a,t,n);document.addEventListener("drop",m.bind(this,l)),document.addEventListener("dragover",f),r.__dropHandler=m,r.__dragoverHandler=f}static async disable_dropzone(e,a,t,n){const r=await crs.dom.get_element(e.args.element,a,t,n);document.removeEventListener("drop",r.__dropHandler),document.removeEventListener("dragover",r.__dragoverHandler),delete r.__dropHandler,delete r.__dragoverHandler}}class p{static async blob(e){return new Promise(a=>{const t=new FileReader;t.onload=()=>{t.onload=null,a(t.result)},t.readAsArrayBuffer(e)})}}async function d(i){const e=i.split("/"),t=e[e.length-1].split("."),n=t[t.length-1];return{name:t[0],ext:n}}async function w(){return new Promise(i=>{let e=document.createElement("input");e.type="file",e.setAttribute("multiple","multiple"),e.onchange=()=>{e.onchange=null;const a=Array.from(e.files);i(a)},e.click()})}async function y(i,e,a,t){const n=await crs.process.getValue(i.args.files,e,a,t),r=[];for(const l of n){const o=await d(l);r.push({name:o.name,ext:o.ext,value:await fetch(l).then(s=>s.blob())})}return r}async function f(i){i.preventDefault()}async function m(i,e){e.preventDefault();const a=e.dataTransfer.files,t=[];for(const n of a){const r=await d(n.name);t.push({type:n.type,name:r.name,ext:r.ext,size:n.size,value:await n.arrayBuffer()})}i.call(this,t)}crs.intent.file=g;export{g as FileActions,p as FileFormatter,d as get_file_name,y as get_files};
