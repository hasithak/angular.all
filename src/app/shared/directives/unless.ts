import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { LoggingService } from '../../core/services/logging';

@Directive({
  selector: '[appUnless]',
  standalone: true,
})
export class UnlessDirective {
  private hasView = false;

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly logger: LoggingService
  ) {}

  @Input()
  public set appUnless(condition: boolean) {
    this.logger.debug(`UnlessDirective condition updated to: ${condition}`, 'UnlessDirective');
    
    if (!condition && !this.hasView) {
      // If the condition is false and we don't have a view yet, create the view in the container
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
      this.logger.debug('UnlessDirective rendered template content', 'UnlessDirective');
    } else if (condition && this.hasView) {
      // If the condition is true and we are currently rendering the view, clear the container
      this.viewContainer.clear();
      this.hasView = false;
      this.logger.debug('UnlessDirective cleared template content', 'UnlessDirective');
    }
  }
}
