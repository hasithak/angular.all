import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { LoggingService } from '../../core/services/logging';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnInit {
  @Input() defaultColor = 'transparent';
  @Input('appHighlight') highlightColor = 'rgba(63, 81, 181, 0.15)'; // Default Material Indigo hue

  // Binding element's style property directly to a property of this directive
  @HostBinding('style.backgroundColor') backgroundColor!: string;
  @HostBinding('style.transition') transition = 'background-color 0.3s ease, transform 0.2s ease';
  @HostBinding('style.borderRadius') borderRadius = '8px';

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2,
    private readonly logger: LoggingService
  ) {}

  public ngOnInit(): void {
    this.backgroundColor = this.defaultColor;
  }

  // Listening to native mouse events
  @HostListener('mouseenter') 
  public onMouseEnter(): void {
    this.highlight(this.highlightColor);
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-2px)');
    this.logger.debug('Highlight directive active: Mouse entered element', 'HighlightDirective');
  }

  @HostListener('mouseleave') 
  public onMouseLeave(): void {
    this.highlight(this.defaultColor);
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
    this.logger.debug('Highlight directive inactive: Mouse left element', 'HighlightDirective');
  }

  private highlight(color: string): void {
    this.backgroundColor = color;
  }
}
