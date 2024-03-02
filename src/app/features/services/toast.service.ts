import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { ToastComponent } from '../../components/shared/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(
    private resolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) {}

  showToast(message: string) {
    const toastFactory = this.resolver.resolveComponentFactory(ToastComponent);
    const toastRef = toastFactory.create(this.injector);
    toastRef.instance.message = message;
    this.applicationRef.attachView(toastRef.hostView);
    const domElement = (toastRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElement);

    setTimeout(() => {
      this.applicationRef.detachView(toastRef.hostView);
      toastRef.destroy();
    }, 3000);
  }
}
