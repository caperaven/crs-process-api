class r{#t={};get(t,s){return new Promise(async l=>{if(this.#t[t]||={count:0,queue:[],loading:!1,template:null},this.#t[t].count+=1,this.#t[t].template==null&&this.#t[t].loading===!1){this.#t[t].loading=!0;const i=await fetch(s).then(e=>e.text()),o=document.createElement("template");o.innerHTML=i,this.#t[t].template=o;for(const e of this.#t[t].queue)e();delete this.#t[t].loading,delete this.#t[t].queue,l(n(this.#t[t].template))}this.#t[t].template==null?this.#t[t].queue.push(()=>{l(n(this.#t[t].template))}):l(n(this.#t[t].template))})}async createStoreFromElement(t,s){const l=this.#t[t]||={count:0,template:{}},i=s.querySelectorAll("template");let o=null;for(const e of i){const c=e.id||e.dataset.id;l.template[c]=e,e.dataset.default==="true"&&(o=c)}return o}async getStoreTemplate(t,s){return this.#t[t]?.template[s]?.content.cloneNode(!0)}async remove(t){this.#t[t]!=null&&(this.#t[t].count-=1,this.#t[t].count===0&&(this.#t[t].count=null,this.#t[t].template=null,delete this.#t[t]))}}function n(u){const t=u.content.cloneNode(!0);return t.innerHTML||t.textContent}export{r as TemplatesManager};
