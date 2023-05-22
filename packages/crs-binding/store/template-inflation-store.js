class i{#t={};add(t,e,l){this.#t[t]={template:e,fn:l}}get(t){return this.#t[t]}remove(t){const e=this.#t[t];delete this.#t[t],e.template=null,e.fn=null}}export{i as TemplateInflationStore};
