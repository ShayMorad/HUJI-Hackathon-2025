import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

/**
 * AdminDashboard shows an overview of all wards for administrators.
 */
export class AdminDashboard extends React.Component<{ wards: any[] }> {
  render() {
    return (
      <div className="p-4">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Hospital Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {this.props.wards.map((w) => (
                <div key={w.ward_id} className="p-4 bg-white rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold">{w.name}</h3>
                  <p>Occupancy: {w.occupancy}/{w.capacity}</p>
                  <p>Free Beds: {w.capacity - w.occupancy}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
