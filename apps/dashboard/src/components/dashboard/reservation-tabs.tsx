"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReservationDashboardView } from "@/lib/booking/services/listing.service";

import { ReservationList } from "./reservation-list";

export function ReservationTabs({ view }: { view: ReservationDashboardView }) {
  return (
    <Tabs defaultValue="today">
      <TabsList>
        <TabsTrigger value="today">Aujourd&apos;hui ({view.today.length})</TabsTrigger>
        <TabsTrigger value="upcoming">À venir ({view.upcoming.length})</TabsTrigger>
        <TabsTrigger value="completed">Terminées ({view.completed.length})</TabsTrigger>
        <TabsTrigger value="cancelled">Annulées ({view.cancelled.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="today">
        <ReservationList reservations={view.today} />
      </TabsContent>
      <TabsContent value="upcoming">
        <ReservationList reservations={view.upcoming} />
      </TabsContent>
      <TabsContent value="completed">
        <ReservationList reservations={view.completed} readOnly />
      </TabsContent>
      <TabsContent value="cancelled">
        <ReservationList reservations={view.cancelled} readOnly />
      </TabsContent>
    </Tabs>
  );
}
