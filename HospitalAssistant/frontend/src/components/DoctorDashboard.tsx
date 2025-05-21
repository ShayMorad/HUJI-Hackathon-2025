import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

/**
 * DoctorDashboard provides search, filtering, and patient case cards for doctors.
 */
export class DoctorDashboard extends React.Component<{ cases: any[] }> {
  render() {
    return (
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <Input placeholder="Search patients..." className="w-1/2" />
          <Select>
            <SelectTrigger className="w-1/3">
              <span>Select Risk Level</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {this.props.cases.map((c) => (
            <Card key={c.id} className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle>{c.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Diagnosis: {c.diagnosis}</p>
                <p>Next Action: {c.recommendation}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
}
