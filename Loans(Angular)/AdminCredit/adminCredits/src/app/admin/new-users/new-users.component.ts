import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsersService } from 'src/app/shared/users/users.service';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.css']
})
export class NewUsersComponent implements OnInit {
  userApplications: any[] = [];
  selectedTab: string = 'All';
  filteredApplications: any[] = [];
  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getUserApplications();
  }
  unrejectOptionsVisible: number | null = null;

  toggleUnrejectOptions(applicationId: number): void {
    this.unrejectOptionsVisible = this.unrejectOptionsVisible === applicationId ? null : applicationId;
  }
  searchTerm: string = '';
  changeTab(tab: string): void {
    this.selectedTab = tab;
  }

  filterApplications(): any[] {
    return this.userApplications.filter(application => {
      if (this.selectedTab !== 'All' && application.status !== this.selectedTab) {
        return false;
      }
      return application.full_name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  isImage(fileUrl: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = this.getFileExtension(fileUrl);
    return imageExtensions.includes(extension);
  }

  isPDF(fileUrl: string): boolean {
    return this.getFileExtension(fileUrl) === 'pdf';
  }

  isZIP(fileUrl: string): boolean {
    const zipExtensions = ['zip', 'rar', '7z'];
    return zipExtensions.includes(this.getFileExtension(fileUrl));
  }

  getFileExtension(fileUrl: string): string {
    return fileUrl.split('.').pop()?.toLowerCase() || '';
  }

  // Fetch user applications
  getUserApplications() {
    this.userService.userApplications().subscribe(
      (res: any) => {
        this.userApplications = res
          .filter(
            (application: any) => application.status !== 'Approved'
          )
          .map((application: any) => ({
            ...application,
            identity_proof: `https://api-docs.opticatijuana.com/${application.identity_proof}`,
            proof_of_residence: `https://api-docs.opticatijuana.com/${application.proof_of_residence}`,
            proof_of_income: `https://api-docs.opticatijuana.com/${application.proof_of_income}`
          }));

        console.log('User Applications:', this.userApplications);
      },
      (err: any) => {
        console.error('Error fetching user applications:', err);
      }
    );
  }


  


  showUnrejectOptions(application: any) {
    application.showUnrejectOptions = true;
  }
  // Handle status change
  statusChanged(applicationId: number, status: string, userId: number) {
    if (status === 'Approved') {
      Swal.fire({
        title: 'Ingrese el límite de crédito',
        input: 'number',
        inputPlaceholder: 'Ingrese el límite de crédito',
        showCancelButton: true,
        confirmButtonText: 'Aprobar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          const creditLimit = parseFloat(value);
          if (!value) {
            return '¡El límite de crédito es obligatorio!';
          }
          if (isNaN(creditLimit) || creditLimit <= 0) {
            return 'Por favor, introduzca un límite de crédito válido';
          }
          return undefined;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const creditLimit = parseFloat(result.value);
          this.updateCreditLimit(userId, creditLimit)
            .then(() => this.changeStatus(applicationId, status, '', userId))
            .then(() => {
              this.getUserApplications();
              Swal.fire('Éxito', '¡Límite de crédito añadido y estado actualizado!', 'success');
            })
            .catch((error) => {
              console.error('Error en el proceso:', error);
              Swal.fire('Error', '¡Algo salió mal!', 'error');
            });
        }
      });
    } else if (status === 'Review Required') {
      Swal.fire({
        title: 'Ingrese un mensaje de revisión',
        input: 'text',
        inputPlaceholder: 'Ingrese un mensaje para la revisión',
        showCancelButton: true,
        confirmButtonText: 'Enviar revisión',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return '¡El mensaje de revisión es obligatorio!';
          }
          return undefined;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const reviewMessage = result.value;
          this.changeStatus(applicationId, status, reviewMessage, userId)
            .then(() => {
              this.getUserApplications();
              Swal.fire('Éxito', '¡Mensaje de revisión añadido y estado actualizado!', 'success');
            })
            .catch((error) => {
              console.error('Error en el proceso:', error);
              Swal.fire('Error', '¡Algo salió mal!', 'error');
            });
        }
      });
    }
    else if (status === 'Rejected') {
      Swal.fire({
        title: 'Ingrese un mensaje',
        input: 'text',
        inputPlaceholder: 'Razón para el rechazo',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return '¡Se requiere un mensaje de rechazo!';
          }
          return undefined;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const rejectMessage = result.value;
          this.changeStatus(applicationId, status, rejectMessage, userId)
            .then(() => {
              this.getUserApplications();
              Swal.fire('Éxito', '¡Razón agregada y estado actualizado!', 'success');
            })
            .catch((error) => {
              console.error('Error durante el proceso:', error);
              Swal.fire('Error', '¡Algo salió mal!', 'error');
            });
        }
      });
    }
    
    else {
      this.changeStatus(applicationId, status, '', userId)
        .then(() => {
          this.getUserApplications();
          Swal.fire('Éxito', '¡Estado actualizado con éxito!', 'success');
        })
        .catch((error) => {
          console.error('Error al cambiar el estado:', error);
          Swal.fire('Error', '¡No se pudo actualizar el estado!', 'error');
        });
    }
  }

  // Change application status
  changeStatus(applicationId: number, status: string, reviewMessage: string = '', userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const body = {
        applicationId,
        status,
        reviewMessage,
        userId
      };

      this.userService.changeStatus(applicationId, status, reviewMessage, userId).subscribe(
        (res: any) => {
          console.log('Estado cambiado con éxito:', res);
          resolve();
        },
        (err: any) => {
          console.error('Error al cambiar el estado:', err);
          reject(err);
        }
      );
    });
  }

  // Update credit limit
  updateCreditLimit(userId: number, creditLimit: number): Promise<void> {
    const body = { userId, creditLimit };
    return new Promise((resolve, reject) => {
      this.userService.creditAdded(body).subscribe(
        (res: any) => {
          console.log('Límite de crédito actualizado con éxito:', res);
          resolve();
        },
        (err: any) => {
          console.error('Error al actualizar el límite de crédito:', err);
          reject(err);
        }
      );
    });
  }
}
