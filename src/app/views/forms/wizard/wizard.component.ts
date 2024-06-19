import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {DataLayerService} from '../../../shared/services/data-layer.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  isCompleted: boolean;
  data: any = {
    email: ''
  };
  step2Form: FormGroup;
  trainingType: string[] = ['Référencement des documents', 'Question-Réponse', 'Génération de Requête'];

  constructor(
    private fb: FormBuilder,
    private dataLayerService: DataLayerService
  ) { }

  ngOnInit() {
    this.step2Form = this.fb.group({
      experience: [2]
    });
  }

  onStep1Next(e) {}
  onStep2Next(e) {}
  onStep3Next(e) {}
  onComplete(e) {}
  downloadData(): void {
    this.dataLayerService.getExportedDataQA().subscribe(data => {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exportedData.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  }
}
