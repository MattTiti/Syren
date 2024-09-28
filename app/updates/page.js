"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import config from "@/config";
import Header from "@/components/landing/Header";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";

export default function AllUpdates() {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="bg-yellow-50">
        <Header />
        <Card className="mt-10 text-neutral-700 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">All Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {config.updates.map((update, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <li className="border-t border-neutral-200 py-2 hover:bg-neutral-100 px-2 flex justify-between cursor-pointer">
                      <span>
                        {update.title.length > 32
                          ? update.title.substring(0, 32) + "..."
                          : update.title}
                      </span>
                      <span className="text-neutral-500">{update.date}</span>
                    </li>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-neutral-700">
                        {update.title} ({update.date})
                      </DialogTitle>
                    </DialogHeader>
                    <div>
                      <p className="text-sm text-neutral-500 whitespace-pre-wrap">
                        {update.description}
                      </p>
                      {update.link && (
                        <a
                          href={update.link}
                          target="_blank"
                          className="text-sm mt-2"
                        >
                          Link:{" "}
                          <span className="text-blue-500 hover:underline">
                            {update.link}
                          </span>
                        </a>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
