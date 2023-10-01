import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../service/core/auth.service';

@Directive({
  selector: '[hasPermision]'
})
export class HasPermisionDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef, 
    private dataService: AuthService
  ) { }

  @Input() set hasPermision(idFuncion: string) {
    // console.log(idFuncion)
    if (this.dataService.funcionesUsuario.includes(idFuncion))
      this.viewContainer.createEmbeddedView(this.templateRef);
    else
      this.viewContainer.clear();
  }

}
