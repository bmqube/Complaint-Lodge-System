package com.msit.nsucls;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.msit.nsucls.api.APIManagerSingleton;
import com.msit.nsucls.api.listeners.CommentListener;
import com.msit.nsucls.api.listeners.ComplaintDetailsListener;
import com.msit.nsucls.helpers.NestedListView;
import com.msit.nsucls.helpers.StorageHandler;
import com.msit.nsucls.models.Complaint;
import com.msit.nsucls.models.ComplaintAgainst;
import com.msit.nsucls.models.ComplaintComment;
import com.msit.nsucls.models.ComplaintEvidence;

import org.w3c.dom.Comment;

import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

public class ComplaintDetails extends AppCompatActivity {

    String complaintToken;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActionBar actionBar = getSupportActionBar();
        assert actionBar != null;
        actionBar.setDisplayHomeAsUpEnabled(true);
        setContentView(R.layout.activity_complaint_details);

        Bundle data = getIntent().getExtras();
        complaintToken = data.getString("complaintToken");
        String userToken = StorageHandler.getDefaults("userToken", ComplaintDetails.this);
        String userSessionToken = StorageHandler.getDefaults("userSessionToken", ComplaintDetails.this);

        APIManagerSingleton.getApiManager(ComplaintDetails.this).getComplaintDetails(userToken, userSessionToken, complaintToken, new ComplaintDetailsListener() {
            @Override
            public void onResponse(com.msit.nsucls.models.ComplaintDetails complaint) {
                LinearLayout commentSection = findViewById(R.id.ci_for_reviewer);
                if (!complaint.getReviewer().getToken().equals(userToken)) {
                    commentSection.setVisibility(View.GONE);
                } else {
                    EditText comment = findViewById(R.id.ci_new_comment);
                    Button commentButton = findViewById(R.id.ci_new_comment_btn);

                    commentButton.setOnClickListener(view -> {
                        if (comment.getText().toString().isEmpty()) {
                            comment.setError("Comment can not be empty");
                        } else {
                            APIManagerSingleton.getApiManager(ComplaintDetails.this).postComment(userToken, userSessionToken, complaintToken, comment.getText().toString(), new CommentListener() {
                                @Override
                                public void onResponse(String responseMessage) {
                                    Toast.makeText(ComplaintDetails.this, responseMessage, Toast.LENGTH_LONG).show();
                                }

                                @Override
                                public void onError(String e) {
                                    Toast.makeText(ComplaintDetails.this, e, Toast.LENGTH_LONG).show();
                                }
                            });
                        }
                    });
                }

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
                TextView complaintAgainst = findViewById(R.id.cd_complaint_against);
                StringBuilder stringBuilder = new StringBuilder(complaintAgainst.getText());
                TextView status = findViewById(R.id.cd_status);
                TextView reviewer = findViewById(R.id.cd_reviewer);
                TextView lodger = findViewById(R.id.cd_lodger);
                TextView complaintDate = findViewById(R.id.cd_complaint_date);
                TextView body = findViewById(R.id.cd_body);
                ListView evidences = findViewById(R.id.cd_evidences);
                NestedListView comments = findViewById(R.id.cd_comments);
                CommentArrayAdapter commentArrayAdapter = new CommentArrayAdapter(ComplaintDetails.this, Arrays.asList(complaint.getComplaintComments()));
                comments.setAdapter(commentArrayAdapter);
                ArrayAdapter<ComplaintEvidence> evidenceArrayAdapter = new ArrayAdapter<>(ComplaintDetails.this, android.R.layout.simple_list_item_1, complaint.getComplaintEvidences());

                for (ComplaintAgainst complaintAgainst1 : complaint.getComplaintAgainsts()) {

                    if (stringBuilder.length() > 0) {
                        stringBuilder.append(",");
                    }

                    stringBuilder.append(complaintAgainst1.getComplaintAgainst().getFullname());
                }
                complaintAgainst.setText(stringBuilder.toString());
                status.setText(complaint.getStatus());
                reviewer.setText(complaint.getReviewer().getFullname());
                lodger.setText(complaint.getUser().getFullname());
                complaintDate.setText(complaint.getCreatedAt().plusHours(6).toLocalDateTime().format(formatter));
                body.setText(complaint.getDescription());
                evidences.setAdapter(evidenceArrayAdapter);
            }

            @Override
            public void onError(String e) {
                Toast.makeText(ComplaintDetails.this, e, Toast.LENGTH_LONG).show();
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

    class CommentArrayAdapter extends ArrayAdapter<ComplaintComment> {
        Context context;
        List<ComplaintComment> commentList;

        public CommentArrayAdapter(@NonNull Context context, List<ComplaintComment> commentList) {
            super(context, R.layout.comment_item, commentList);
            this.context = context;
            this.commentList = commentList;
        }

        @SuppressLint("SetTextI18n")
        @NonNull
        @Override
        public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            LayoutInflater layoutInflater = (LayoutInflater) getApplicationContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            View commentItem = layoutInflater.inflate(R.layout.comment_item, parent, false);

            TextView reviewer = commentItem.findViewById(R.id.ci_reviewer);
            TextView date = commentItem.findViewById(R.id.ci_comment_date);
            TextView body = commentItem.findViewById(R.id.ci_body);

            reviewer.setText(commentList.get(position).getAuthor().getFullname());
            date.setText(commentList.get(position).getCreatedAt().plusHours(6).toLocalDateTime().format(formatter));
            body.setText(commentList.get(position).getComment());

            return commentItem;
        }
    }
}