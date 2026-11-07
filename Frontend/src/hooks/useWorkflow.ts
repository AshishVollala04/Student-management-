/**
 * FutureSchool - useWorkflow Hook
 * Provides reactive access to central simulated workflows with both tuple and object destructuring support
 */

import { useState, useEffect } from 'react';
import { workflowStore, WorkflowState } from '../mock/workflowStore';

export function useWorkflow() {
  const [state, setState] = useState<WorkflowState>(() => workflowStore.getState());

  useEffect(() => {
    const unsubscribe = workflowStore.subscribe(() => {
      setState({ ...workflowStore.getState() });
    });
    return unsubscribe;
  }, []);

  // Compute convenient mapped helpers
  const hallTicketCleared = 
    state.fees.hallTicketCleared || 
    state.hallTickets.some(h => h.feeCleared || h.principalOverride || h.classTeacherReleased);

  const configChanges = state.configs.map(c => ({
    id: c.id,
    title: c.title,
    description: `Administrative Master Policy: ${c.title} (${c.version})`,
    requestedBy: c.submittedByAdmin,
    requestedAt: '2027-04-10',
    approvedAt: c.principalSignoff ? '2027-04-11' : undefined,
    executedAt: c.executedByAdmin ? '2027-04-12' : undefined,
    status: c.status
  }));

  const helpers = {
    state,
    store: workflowStore,
    leaveRequests: state.leaveRequests,
    teacherLeaves: state.teacherLeaves,
    marksEntries: state.marksEntries,
    reportCards: state.reportCards,
    fees: state.fees,
    hallTickets: state.hallTickets,
    transportRequests: state.transportRequests,
    complaints: state.complaints,
    configs: state.configs,
    configChanges,
    hallTicketCleared,

    // Methods
    executeConfigChange: (id: string) => workflowStore.adminExecuteConfig(id),
    approveTransportRequest: (id: string) => workflowStore.approveTransportChange(id),
    overrideHallTicketClearance: (reason: string) => workflowStore.principalOverrideHallTicket('GVS-2027-0001', reason),
    fastForwardScenario: (scenario: number) => workflowStore.applyScenario(scenario),
    resetDemoData: () => workflowStore.resetToDefault()
  };

  // Create an array tuple [state, store] that also has all helper properties attached
  const tuple = [state, workflowStore] as [WorkflowState, typeof workflowStore] & typeof helpers;
  Object.assign(tuple, helpers);

  return tuple;
}
