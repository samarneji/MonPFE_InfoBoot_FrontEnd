import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { DataLayerService } from '../../../shared/services/data-layer.service';

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
      domaine: [null, Validators.required],
      project: [null, Validators.required],
      titre: [null, Validators.required],
      description: [null],
      language: [null, Validators.required],
      fichier: [null, Validators.required]
    });
  }

  submit() {
    if (this.formBasic.valid && this.file) {
      this.loading = true;

      const formData = new FormData();
      formData.append('fichier', this.file, this.file.name);
      formData.append('titre', this.formBasic.get('titre').value);
      formData.append('type_document', 'pdf'); // Type document fixé à 'pdf'
      formData.append('description', this.formBasic.get('description').value || '');
      formData.append('language', this.formBasic.get('language').value);
      formData.append('domaine', this.formBasic.get('domaine').value);
      formData.append('project', this.formBasic.get('project').value);

      this.http.post('http://127.0.0.1:2387/upload/', formData).subscribe({
        next: (response) => {
          this.toastr.success('Document téléchargé avec succès.', 'Succès!');
          this.formBasic.reset();
          this.loading = false;
        },
        error: (error) => {
          this.toastr.error('Échec du téléchargement du fichier et des données. ' + error.message, 'Erreur!');
          this.loading = false;
        }
      });
    } else {
      this.toastr.error('Veuillez remplir tous les champs obligatoires.', 'Form Incomplete!');
      console.log('errr');
      this.loading = false;
    }
  }
}
