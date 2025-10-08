"use client";

import { useState } from "react";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewStats from "./ReviewStats";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

interface ProductReviewsProps {
  productId: string;
  productName: string;
  showReviewForm?: boolean;
}

export default function ProductReviews({
  productId,
  productName,
  showReviewForm = true,
}: ProductReviewsProps) {
  const [activeTab, setActiveTab] = useState("reviews");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSubmitted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Customer Reviews
        </h2>
        <p className="text-muted-foreground">
          See what our customers are saying about {productName}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="write" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Write Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Review Stats */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReviewStats productId={productId} />
                </CardContent>
              </Card>
            </div>

            {/* Review List */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReviewList
                    key={refreshKey}
                    productId={productId}
                    limit={5}
                    showLoadMore={true}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="write">
          {showReviewForm ? (
            <ReviewForm
              productId={productId}
              productName={productName}
              onReviewSubmitted={handleReviewSubmitted}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Sign in to write a review
                </h3>
                <p className="text-muted-foreground mb-4">
                  You need to be signed in to write a review for this product.
                </p>
                <Button asChild>
                  <a href="/sign-in">Sign In</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
