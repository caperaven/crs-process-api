class TemplateProvider {
  async parse(element, context) {
    await crs.binding.templateProviders.executeTemplateAction(element, context);
  }
}
export {
  TemplateProvider as default
};
