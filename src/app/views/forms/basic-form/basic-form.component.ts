import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import {DataLayerService} from '../../../shared/services/data-layer.service';


@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})
export class BasicFormComponent implements OnInit {
  formBasic: FormGroup;
  loading: boolean;
  radioGroup: FormGroup;
  domaines: any[] = [];
  projects: any[] = [];
  file: File | null = null;

  constructor(
      private fb: FormBuilder,
      private toastr: ToastrService,
      private http: HttpClient,
      private dataLayerService: DataLayerService
  ) {
  }
  ngOnInit() {
    this.buildFormBasic();
    this.radioGroup = this.fb.group({
      radio: []
    });
    this.formBasic = this.fb.group({
      titre: ['', Validators.required],
      type_document: ['', Validators.required],
      description: [''],
      language: ['', Validators.required],
      project: ['', Validators.required],
      domaine: ['', Validators.required],
      fichier: [null, Validators.required]
    });
    this.dataLayerService.getDomaines().subscribe(
        (data) => {
          console.log('Domaines:', data);
          this.domaines = data;
        },
        (error) => {
          this.toastr.error('Error loading domaines');
          console.error('Error loading domaines:', error);
        }
    );

    this.dataLayerService.getProjects().subscribe(
        (data) => {
          console.log('Projects:', data);
          this.projects = data;
        },
        (error) => {
          this.toastr.error('Error loading projects');
          console.error('Error loading projects:', error);
        }
    );
  }
  handleFileInput(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.file = element.files[0];
    }
  }
  buildFormBasic() {
    this.formBasic = this.fb.group({
      domaine: [null, Validators.required],  // Ajoutez vos propres validateurs si nécessaire
      project: [null, Validators.required],
      titre: [null, Validators.required],
      type_document: [null, Validators.required],
      description: [null],
      language: [null, Validators.required],
      fichier: [null, Validators.required]  // Contrôleur pour le fichier
    });
  }
  submit() {
      if (this.formBasic.valid && this.file) {
        this.loading = true; // Afficher l'indicateur de chargement

        const formData = new FormData();
        formData.append('fichier', this.file, this.file.name);
        formData.append('titre', this.formBasic.get('titre').value);
        formData.append('type_document', this.formBasic.get('type_document').value);
        formData.append('description', this.formBasic.get('description').value || ''); // Gérer les valeurs nulles
        formData.append('language', this.formBasic.get('language').value);
        formData.append('domaine', this.formBasic.get('domaine').value); // Assurez-vous que cela correspond à l'ID du domaine
        formData.append('project', this.formBasic.get('project').value); // Assurez-vous que cela correspond à l'ID du projet



        // Faire la requête POST
        this.http.post('http://127.0.0.1:2387/upload/', formData).subscribe({
          next: (response) => {
            this.toastr.success('File and data uploaded successfully.', 'Success!');
            this.formBasic.reset(); // Réinitialiser le formulaire après le téléchargement réussi
            this.loading = false; // Cacher l'indicateur de chargement
          },
          error: (error) => {
            this.toastr.error('Failed to upload file and data. ' + error.message, 'Error!');
            this.loading = false; // Cacher l'indicateur de chargement
          }
        });
      } else {
        this.toastr.error('Please fill in all required fields.', 'Form Incomplete!');
        this.loading = false; // Cacher l'indicateur de chargement si le formulaire n'est pas valide
      }
  }


}
