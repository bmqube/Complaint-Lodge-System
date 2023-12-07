package com.msit.nsucls;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import com.msit.nsucls.api.APIManagerSingleton;
import com.msit.nsucls.api.listeners.MyComplaintsListener;
import com.msit.nsucls.helpers.StorageHandler;
import com.msit.nsucls.models.Complaint;

import java.time.format.DateTimeFormatter;
import java.util.List;

public class ReviewComplaints extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActionBar actionBar = getSupportActionBar();
        assert actionBar != null;
        actionBar.setDisplayHomeAsUpEnabled(true);
        setContentView(R.layout.activity_review_complaints);

        ListView complaintListView = findViewById(R.id.complaint_list);

        String userToken = StorageHandler.getDefaults("userToken", ReviewComplaints.this);
        String userSessionToken = StorageHandler.getDefaults("userSessionToken", ReviewComplaints.this);

        APIManagerSingleton.getApiManager(ReviewComplaints.this).getListOfComplaint(userToken, userSessionToken,  false, new MyComplaintsListener() {
            @Override
            public void onResponse(List<Complaint> complaintList) {
                LodgedComplaintAdapter lodgedComplaintAdapter = new LodgedComplaintAdapter(ReviewComplaints.this, complaintList);
                complaintListView.setAdapter(lodgedComplaintAdapter);

                complaintListView.setOnItemClickListener((adapterView, view, i, l) -> {
                    Intent complaintDetails = new Intent(ReviewComplaints.this, ComplaintDetails.class);
                    complaintDetails.putExtra("complaintToken", complaintList.get(i).getToken());
                    startActivity(complaintDetails);
                });
            }

            @Override
            public void onError(String error) {
                Toast.makeText(ReviewComplaints.this, error, Toast.LENGTH_LONG).show();
            }
        });
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                onBackPressed();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    class LodgedComplaintAdapter extends ArrayAdapter<Complaint> {
        Context context;
        List<Complaint> complaintList;

        public LodgedComplaintAdapter(@NonNull Context context, List<Complaint> complaintList) {
            super(context, R.layout.complaint_item, complaintList);
            this.context = context;
            this.complaintList = complaintList;
        }

        @SuppressLint("SetTextI18n")
        @NonNull
        @Override
        public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            LayoutInflater layoutInflater = (LayoutInflater) getApplicationContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            View complaintItem = layoutInflater.inflate(R.layout.complaint_item, parent, false);

            TextView complaintNo = complaintItem.findViewById(R.id.cd_complaint_no);
            TextView reviewer = complaintItem.findViewById(R.id.cd_user_name);
            TextView status = complaintItem.findViewById(R.id.cd_complaint_status);
            TextView date = complaintItem.findViewById(R.id.cd_complaint_date);


            complaintNo.setText("#" + (position + 1));
            reviewer.setText("Reviewer: " + complaintList.get(position).getReviewer().getFullname());
            status.setText(complaintList.get(position).getStatus());
            date.setText(complaintList.get(position).getUpdatedAt().plusHours(6).toLocalDateTime().format(formatter));

            return complaintItem;
        }
    }
}