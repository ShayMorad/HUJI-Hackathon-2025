import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

/**
 * NurseDashboard shows a grid of patient cards with status and quick actions.
 */
export class NurseDashboard extends React.Component<{ patients: any[] }> {
  render() {
    return (
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {this.props.patients.map((patient) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-2xl shadow-md p-4">
              <CardHeader>
                <CardTitle className="text-xl">{patient.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Status:{' '}
                  <span className={patient.status === 'unstable' ? 'text-red-600' : 'text-green-600'}>
                    {patient.status}
                  </span>
                </p>
                <Button className="mt-2 w-full">View Details</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }
}
